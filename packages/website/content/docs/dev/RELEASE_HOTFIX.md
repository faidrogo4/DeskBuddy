# Prepare a hotfix

- Create a hotfix branch: `git checkout -b hotfix-vX.Y.Z`
- Make changes to the code and/or `cherry-pick` changes from another branch and commit changes.
- Test the hotfix and binaries.
- Bump the version in `package.json` and `packages/desktop/package.json` (see [Shipping DeskBuddy, step 4](RELEASE.md#4-bump-the-version)).
- Push a matching tag from the hotfix branch: `git tag vX.Y.Z && git push origin vX.Y.Z`. The **Run workflow** button only releases from `develop`, so a hotfix release starts from a tag.

**How to cherry pick?**

You can pick commits from another branch and apply the commit to the current one.

- `git checkout hotfix-vX.Y.Z`
- `git cherry-pick <full commit hash>`
- Please resolve all conflicts and `git commit` the changes if needed.
