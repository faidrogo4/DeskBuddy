# Shipping DeskBuddy

This is the path a change takes from an idea to the copy of DeskBuddy installed on your computer. Steps 1–3 happen for every change; steps 4–5 only when you want to publish what has collected on `develop`.

```
idea → branch + PR → CI + try the PR's installer → merge to develop → bump version → Run "Release DeskBuddy" → Help → Check for Updates
```

## 1. Work on a branch and open a PR

Every change goes through a pull request into `develop`, never a direct push.

- Name the branch after the change: `feat/<topic>`, `fix/<topic>`, or `claude/<topic>` for work done in a Claude session.
- Keep one change per PR. A feature and an unrelated fix in one PR means a problem in either blocks both.
- Fill in the PR template's **Test plan** honestly, including what wasn't tested.

## 2. Let CI check it, and try the installer

Opening the PR runs these workflows. They must be green before merging:

| Workflow                              | What it checks                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| Lint, Test, typecheck                 | Code style, unit tests, `vue-tsc`                                                  |
| E2E Test                              | The real Electron app driven by Playwright, ~360 tests. Runs for muya changes too. |
| Muya Build / Test / Spec / Lint / E2E | The editor engine in `packages/muya`, when it changes                              |
| PR Build                              | Installers for Linux, Windows x64/arm64 and macOS x64/arm64                        |

When PR Build finishes it posts a comment on the PR with download links for each installer, kept for 30 days. Install the one for your computer and try the change in the real app before merging. That is the only check that covers things no test looks at, like how a feature feels to use.

Two checks are known to be red or slow for reasons unrelated to a PR:

- **Deploy website** skips its Cloudflare steps until the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets are set, so it should be green; if it fails, look at its lint or build step.
- **macos-arm64** builds sometimes never get a GitHub runner and are cancelled after about 15 minutes. That says nothing about the code; the other platforms still build and are still linked.

## 3. Merge

Merge into `develop` once CI is green and you're happy with the installer. `develop` should always be releasable.

## 4. Bump the version

The release version comes from `version` in **both** `package.json` and `packages/desktop/package.json`. They must match, and each release needs a version that hasn't been released before.

| You want to publish            | Version                           | Who gets it                                        |
| ------------------------------ | --------------------------------- | -------------------------------------------------- |
| A build for yourself / testers | `0.21.0-dev.3`, `0.21.0-dev.4`, … | Installs that are already on a pre-release         |
| A stable release               | `0.21.0`                          | Everyone; stable installs only see stable releases |

Change both files in a small PR (or ask Claude: "bump DeskBuddy to 0.21.0-dev.3"), and merge it. To edit them from a terminal:

```bash
npm version --no-git-tag-version 0.21.0-dev.3
```

```bash
npm --prefix packages/desktop version --no-git-tag-version 0.21.0-dev.3
```

These use npm rather than pnpm on purpose: `pnpm --dir packages/desktop version` treats the folder as a command name and fails.

## 5. Run the release

On GitHub: **Actions → Release DeskBuddy → Run workflow**, branch `develop`, then **Run workflow**.

The workflow:

1. **Validates** that the two `package.json` versions match and that tag `v<version>` doesn't exist yet. If it does, bump the version (step 4) first.
2. **Builds** all five platforms in parallel (15–30 minutes).
3. **Publishes** a GitHub Release tagged `v<version>` with every installer and `SHA256SUMS.txt`. Versions with a `-` (like `0.21.0-dev.3`) are marked pre-release. If a platform failed or never got a runner, the release still publishes and its notes list the missing platform. The one exception is Windows x64: without it the release stops, because Windows x64 PCs would otherwise be offered the arm64 installer.

Pushing a `v*` tag by hand (`git tag v0.21.0-dev.3 && git push origin v0.21.0-dev.3`) runs the same workflow. The tag must match the `package.json` version. That's the way to release from a branch other than `develop`, such as a [hotfix](RELEASE_HOTFIX.md).

## 6. Update your installed app

In the installed app: **Help → Check for Updates** (on macOS, **DeskBuddy → Check for Updates**), download, restart. See [Installation → Updating](../end-user/INSTALLATION.md#updating) for which install types can update themselves.

## Checking a release

The release page should have:

- **Linux** (5): `AppImage`, `deb`, `rpm`, `snap`, `tar.gz`
- **macOS arm64** and **x64** (4 each): `dmg`, `dmg.blockmap`, `zip`, `zip.blockmap`
- **Windows x64** and **arm64** (3 each): `setup.exe`, `setup.exe.blockmap`, `zip`
- **Update manifests**: `latest.yml`, `latest-mac.yml`, `latest-linux.yml` for a stable version. A pre-release names them after its tag instead (`dev.yml`, `dev-mac.yml`, `dev-linux.yml` for `0.21.0-dev.3`). The Windows and macOS manifests each list both architectures; the app picks the installer matching its own.
- `builder-debug.yml` and `SHA256SUMS.txt`
- Release notes listing the PRs merged since the previous release

Platforms listed under **Missing platforms** in the notes can be added by fixing the build and releasing the next version.
