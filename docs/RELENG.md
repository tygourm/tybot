# 🔖 Release Engineering

This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes
2. MINOR version when you add functionality in a backward
   compatible manner
3. PATCH version when you make backward compatible bug fixes

Additional labels for pre-release and build metadata are
available as extensions to the MAJOR.MINOR.PATCH format.

## 🚀 Release

From `develop` branch:

- `git checkout -b release/x.y.z`, last checks, lint, format and
  tests
- Update the references to the current version in the sources
- `uv sync --all-groups --all-packages` to update lock files
- Update the [CHANGELOG](CHANGELOG.md), set the new version
  with the release date
- Commit as `🔖 Version x.y.z`, create a release from the
  branch with a tag, and the content of the changelog
- Merge branch into `master` and `develop`

## 🚑️ Hotfix

From `master` branch:

- `git checkout -b hotfix/x.y.z`, last checks, lint, format and
  tests
- Update the references to the current version in the sources
- `uv sync --all-groups --all-packages` to update lock files
- Update the [CHANGELOG](CHANGELOG.md), set the new version
  with the release date
- Commit as `🔖 Version x.y.z`, create a release from the
  branch with a tag, and the content of the changelog
- Merge branch into `master` and `develop`
