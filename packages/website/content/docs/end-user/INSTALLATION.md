# Installation

DeskBuddy is a free, open-source Markdown editor for **Linux**, **macOS** and **Windows**. Pre-built binaries are published with every release on [GitHub releases](https://github.com/faidrogo4/DeskBuddy/releases/latest). Pick the one that matches your platform.

## Windows

| Artifact | When to choose |
| --- | --- |
| `deskbuddy-win-x64-<version>-setup.exe` | Recommended. NSIS installer; per-user install, lets you pick the install directory, creates Start Menu and Desktop shortcuts. |
| `deskbuddy-win-x64-<version>.zip` | Portable zip. Extract anywhere and run `deskbuddy.exe`. See [Portable mode](PORTABLE.md) for details on keeping your data alongside the app. |

After installing, DeskBuddy registers itself as a handler for `.md`, `.markdown`, `.mmd`, `.mdown`, `.mdtxt` and `.mdtext` files.

## macOS

| Artifact | When to choose |
| --- | --- |
| `deskbuddy-mac-arm64-<version>.dmg` | Apple Silicon (M1 / M2 / M3 / M4). |
| `deskbuddy-mac-x64-<version>.dmg` | Intel Macs. |
| `deskbuddy-mac-<arch>-<version>.zip` | Plain zip alternative to the DMG. |

Open the DMG and drag DeskBuddy into your **Applications** folder. Builds are not currently notarized, so the first launch may prompt the system Gatekeeper — right-click the app and choose **Open** to accept it once.

## Linux

DeskBuddy is shipped in five Linux formats. Most users want the AppImage.

| Artifact | When to choose |
| --- | --- |
| `deskbuddy-linux-<version>.AppImage` | Recommended. Runs on most distros without root. `chmod +x` and double-click (or run directly). |
| `deskbuddy-linux-<version>.deb` | Debian, Ubuntu, Linux Mint, Pop!_OS, … (`sudo apt install ./deskbuddy-linux-<version>.deb`). |
| `deskbuddy-linux-<version>.rpm` | Fedora, RHEL, openSUSE, … (`sudo rpm -i deskbuddy-linux-<version>.rpm`). |
| `deskbuddy-linux-<version>.snap` | Ubuntu / any snap-enabled distro (`sudo snap install deskbuddy-linux-<version>.snap --dangerous --classic`). |
| `deskbuddy-linux-<version>.tar.gz` | Portable tarball. Extract and run the included `deskbuddy` binary. |

> [!NOTE]
> See [Linux notes](LINUX.md) for distro-specific tips (sandbox flags, font configuration, file-association quirks).

## Verify the download

All artifacts are listed with their SHA-256 in `SHA256SUMS.txt`. Verify with:

```sh
# Example on macOS / Linux
sha256sum -c SHA256SUMS.txt --ignore-missing
```

## Build from source

If you'd rather build from source — for example to track `develop`, to run on an architecture we don't publish a binary for, or to contribute — see the [Build instructions](../dev/BUILD.md) in the developer docs. A minimal recap:

```sh
git clone https://github.com/faidrogo4/DeskBuddy.git
cd DeskBuddy
pnpm install
pnpm run build
```

Output installers land in the repository's `dist/` folder.

## Updating

DeskBuddy checks for updates on launch (this can be disabled under **Preferences → General → Updates**). When an update is published, the app downloads it in the background and installs on next restart.

Portable installs and the AppImage do not auto-update — re-download the latest artifact when you want to upgrade.

## Uninstall

| Platform | How |
| --- | --- |
| Windows | **Settings → Apps**, or run the bundled `Uninstall DeskBuddy.exe`. |
| macOS | Drag **DeskBuddy.app** to the Trash. Optionally also remove `~/Library/Application Support/deskbuddy`. |
| Linux (.deb) | `sudo apt remove deskbuddy` |
| Linux (.rpm) | `sudo rpm -e deskbuddy` |
| Linux (snap) | `sudo snap remove deskbuddy` |
| Linux (AppImage / tar.gz) | Delete the file you extracted. |

To wipe DeskBuddy's user data as well, remove its [application data directory](APPLICATION_DATA_DIRECTORY.md).
