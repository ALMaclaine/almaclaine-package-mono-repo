# git-utils

Utilities for working with git.

## API

Functions assume user is signed in to git with access to the repository being acted on.

### Listing

#### Functions

- commitProject

### Details

#### Functions

##### commitPackage

Takes a package name and commit description and adds all the files in the package and commits with message:
`<pack>: <desc>`.

Throws an error if not called from the root of a git repository (contains the .git directory).

```typescript
const commitPackage = (pack: string, desc: string) => Void
```
