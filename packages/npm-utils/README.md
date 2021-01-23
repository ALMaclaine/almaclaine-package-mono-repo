# npm-utils

Set of utilities for working with npm and npm packages.

## API

Most functions assume the user is logged into the npm account with access to the relevant packages
and that they are signed in to git with access to the repository being updated.

### Listing

#### Functions

- validPackage
- isNodeModules
- findPackageRoot
- findAllPackages
- packageDependencies
- findDependencies
- packageDependants
- findDependants
- updateChangeLog
- updateDependency
- publishPackage
- updateVersion
- updatePackage
- packageDependencyChain
- updatePackageChain
- initPackage

#### Types

- PackageLocation
- PackagesLocations
- PackageDependencies
- PackagesDependencies
- PackageVersion
- UpdateType
- PackageChain

### Details

#### Functions

##### validPackage
Takes a `string` package name and returns true if it is a valid package name.

Valid package names are of the form word(-word)*, containing no numbers.

```typescript
const validPackage = (pack: string) => boolean
```

##### isNodeModules
Takes a path and determines if it's a path to a `node_modules` directory.

```typescript
const isNodeModules = (path: string) => boolean
```

##### findPackageRoot
Takes a path and finds the package it belongs to by searching each parent directory for a `package.json`.

Throws if no package root is found.

```typescript
const findPackageRoot = (path: string) => string
```

##### findAllPackages
Takes a string representing a root path from which is recursively finds all node packages.
A directory is a package if it has a `package.json` file.

All packages in `node_modules` are ignored, but it will find packages within packages.

Returns a `PackagesLocations` which contains the name and path of every package found.

```typescript
const findAllPackages = (path: string) => PackagesLocations
```

##### packageDependencies
Takes a `PackageLocation` and `string[]` and returns a `PackageDependencies` which contains
both the dependencies and devDependencies of the package in `PackageLocation`.

If the `string[]` is non-empty, any packages not listed will be filtered out.

```typescript
const packageDependencies = (pack: PackageLocation, filterOn: string[] = []) => PackageDependencies
```

##### findDependencies
Takes a `PackagesLocations` and `string[]` and returns a `PackagesDependencies` which contains
both the dependencies and devDependencies of every package in `PackagesLocations`.

If the `string[]` is non-empty, any packages not listed will be filtered out.

```typescript
const findDependencies = (packs: PackagesLocations, filterOn: string[] = []) => PackagesDependencies
```

##### packageDependants
Takes a `string` package name and `PackagesDependencies` and returns a `PackageDependencies`
which contains all the packages that depend on the provided package.

```typescript
const packageDependants = (pack: string, deps: PackagesDependencies) => PackageDependencies
```

##### findDependants
Takes a `PackagesDependencies` which finds the dependants of every package listed
and returns a `PackagesDependencies`.

```typescript
const findDependants = (packs: PackagesDependencies) => PackagesDependencies
```

##### updateChangeLog
Takes a `version: string` and `desc: string` and updates the `CHANGELOG.md` of the current working directory.

It assumes the changelog begins with `# Changelog` as the first line, and will add new entries below it in
the following format:

An error is thrown if the current working directory doesn't contain a `CHANGELOG.md`.

```
## <version>

- <desc>

```

```typescript
const updateChangeLog = (version: string, desc: string) => Void
```

##### updateDependency
Takes a `pack: string` representing the dependency to update along with an optional `version: string`.

If `version: string` is non-empty the function will update using `npm install <pack>@<version>`. If empty
it will use `npm update <pack>`.

An error is thrown if the current working directory doesn't contain a `package.json`.

```typescript
const updateDependency = (pack: string, version: string = "") => Void
```

##### publishPackage
Publishes the npm package.

An error is thrown if the current working directory doesn't contain a `package.json`.

```typescript
const publishPackage = () => Void
```

##### updateVersion
Takes an `UpdateType` bumps the version of a package in the current working directory using `npm version <type>`

If `type` is `UpdateType.INITIAL` the function returns `v1.0.0` without calling `npm version`.

An error is thrown if the current working directory doesn't contain a `package.json`.

```typescript
const updateVersion = (type: UpdateType) => string
```

##### updatePackage
Takes a directory, description and `UpdateType`, changes directory to the provided one
and updates the package using `updateVersion`. Returns a `PackageVersion` object.

```typescript
const updatePackage = (directory: string, desc: string, type: UpdateType) => PackageVersion
```

##### packageDependencyChain
Takes a root path and package name and finds the dependency chain for that package and all the packages it updates.
The chain is ordered so that no package is updated before all a dependency earlier in the chain is updated to prevent
double publishes.

```typescript
const packageDependencyChain = (root: string, pack: string) => PackageChain
```

##### updatePackageChain
Takes a root path, description, `UpdateType` and optional shouldChain parameter and updates
the current working directory package and its chain of dependencies. If shouldChain is false
no update chain occurs.

Throws if root is not a directory, if root is not the parent of the current working directory, and
if current working directory is not a package (doesn't have package.json file).

```typescript
const updatePackageChain = (root: string, desc: string, type: UpdateType, shouldChain: boolean = true) => Void
```

##### initPackage
Takes a folder name and attempts to create a package with all necessary files to begin package development.

```typescript
const initPackage = (folderName: string) => Void
```

#### Types

##### PackageLocation
Represents a npm package storing package name and path.

```typescript
interface PackageLocation {
    name: string;
    path: string;
}
```

##### PackagesLocations
Represents an `Array` of `PackageLocation`s.

```typescript
type PackagesLocations = Array<PackageLocation>
```

##### PackageDependencies
Represents a set of dependencies for an npm package, storing package name and its associated dependencies.

```typescript
interface PackageDependencies {
    name: string;
    dependencies: PackagesVersions;
}
```

##### PackagesDependencies
Represents an `Array` of `PackageDependencies`.

```typescript
type PackagesDependencies = Array<PackageDependencies>
```

##### PackageVersion
Represents a npm package version, stores name of package and version.

```typescript
interface PackageVersion {
    name: string;
    version: string;
}
```

##### PackageVersions
Represents an `Array` of `PackageVersion`s.

```typescript
type PackagesVersions = Array<PackageVersion>;
```

##### UpdateType
Represents the type of package updates that can occur.

```typescript
enum UpdateType {
    MAJOR = 'major',
    MINOR = 'minor',
    PATCH = 'patch',
    INITIAL = 'initial'
}
```

##### PackageChain
Stores a dependency chain, and the set dependencies of all packages found from a root path.

A dependency chain is the most efficient path for updating dependant packages that may be encountered
multiple times.

```typescript
interface PackageChain {
    chain: PackagesLocations,
    dependencies: PackagesDependencies
}
```
