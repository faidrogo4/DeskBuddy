"""Flatten per-platform release artifacts into one folder for publishing.

Each platform build uploads its installers plus an electron-updater manifest
(latest.yml, latest-mac.yml, latest-linux.yml; a configured update channel
would replace "latest"). Builds for the same OS write the same manifest name,
both Windows builds latest.yml and both macOS builds latest-mac.yml, so copying
them into one folder makes one overwrite the other. The surviving manifest then
lists only one architecture, and electron-updater falls back to whatever
installer it lists, which can hand an x64 PC the arm64 installer.

This script copies every non-manifest file as-is and merges same-named
manifests by combining their `files` lists. electron-updater picks the entry
whose URL contains the running process.arch, so one merged manifest serves
both architectures.

Usage: merge_release_artifacts.py <artifacts-dir> <out-dir> <expected-artifact>...
Writes the names of expected artifacts that are missing to <out-dir>/../missing-platforms.txt.
"""

import datetime
import filecmp
import shutil
import sys
from pathlib import Path

import yaml

YAML_SUFFIXES = ('.yml', '.yaml')


def load_yaml(path: Path):
    return yaml.safe_load(path.read_text(encoding='utf-8'))


def is_update_manifest(data) -> bool:
    return isinstance(data, dict) and 'version' in data and isinstance(data.get('files'), list)


def is_windows_manifest(name: str) -> bool:
    stem = name.rsplit('.', 1)[0]
    return not (stem.endswith('-mac') or '-linux' in stem)


def normalize_manifest(data: dict) -> dict:
    # electron-builder quotes releaseDate, but keep it a string even if a
    # future version stops quoting it, so it round-trips unchanged.
    for key, value in list(data.items()):
        if isinstance(value, (datetime.date, datetime.datetime)):
            data[key] = value.isoformat()
    return data


def artifact_order(directory: Path) -> tuple:
    # The x64 build provides the manifest's top-level fields (path, sha512),
    # which older electron-updater versions read instead of `files`.
    return (0 if 'x64' in directory.name else 1, directory.name)


def check_windows_manifest(name: str, manifest: dict) -> None:
    urls = [entry['url'] for entry in manifest.get('files', [])]
    exes = [url for url in urls if url.lower().endswith('.exe')]
    if exes and not any('x64' in url for url in exes):
        sys.exit(
            f'{name} lists only {exes}: an x64 PC would be offered a non-x64 '
            'installer. Refusing to publish without the windows-x64 build.'
        )


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    artifacts_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
    expected = sys.argv[3:]
    out_dir.mkdir(parents=True, exist_ok=True)

    present = sorted((d for d in artifacts_dir.iterdir() if d.is_dir()), key=artifact_order)
    if not present:
        sys.exit(f'No artifacts found in {artifacts_dir}')

    manifests: dict[str, list[dict]] = {}
    for directory in present:
        for file in sorted(directory.iterdir()):
            target = out_dir / file.name
            if file.suffix in YAML_SUFFIXES:
                data = load_yaml(file)
                if is_update_manifest(data):
                    manifests.setdefault(file.name, []).append(normalize_manifest(data))
                elif not target.exists():
                    # builder-debug.yml differs per build and only aids debugging.
                    shutil.copy2(file, target)
                continue
            if target.exists() and not filecmp.cmp(file, target, shallow=False):
                sys.exit(f'Two builds produced different files named {file.name}')
            shutil.copy2(file, target)

    for name, parts in manifests.items():
        merged = dict(parts[0])
        seen = set()
        files = []
        for part in parts:
            if part.get('version') != merged.get('version'):
                sys.exit(f'{name}: builds disagree on version ({part.get("version")} vs {merged.get("version")})')
            for entry in part.get('files', []):
                if entry['url'] not in seen:
                    seen.add(entry['url'])
                    files.append(entry)
        merged['files'] = files
        if is_windows_manifest(name):
            check_windows_manifest(name, merged)
        (out_dir / name).write_text(
            yaml.safe_dump(merged, sort_keys=False, default_flow_style=False),
            encoding='utf-8',
        )
        print(f'{name}: {len(files)} file(s) from {len(parts)} build(s)')

    present_names = {d.name for d in present}
    missing = [name for name in expected if name not in present_names]
    (out_dir.parent / 'missing-platforms.txt').write_text('\n'.join(missing), encoding='utf-8')
    print('Missing platforms:', ', '.join(missing) if missing else 'none')


if __name__ == '__main__':
    main()
