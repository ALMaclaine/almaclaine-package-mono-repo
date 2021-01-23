# fs-utils

Utilities for working with the file system.

## API

### Listing

#### Functions

- join
- resolve
- existsSync
- copyFileSync
- isHidden
- makeCwdRelPath
- isDirectorySync
- readDirectorySync
- makeDirectorySync
- importJson
- readFileAsStringSync
- writeFileAsStringSync
- doesNotExistError
- alreadyExistsError
- isNotDirectoryError
- isDirectoryError
- isNotJsonFileError

### Details

#### Functions

##### join
Re-exported from `path`.

```typescript
const join = (...paths: Array<string>) => string
```

##### resolve
Re-exported from `path`.

```typescript
const resolve = (...paths: Array<string>) => string
```

##### existsSync
Re-exported from `fs`.

```typescript
const existsSync = (path: string | Buffer | URL) => boolean
```

##### copyFileSync
Re-exported from `fs`.

```typescript
const copyFileSync = (src: PathLike, dest: PathLike, flags?: number) => Void
```

##### isHidden
Takes a file path and returns whether its hidden or not.

Throws error if path does not exist.

```typescript
const isHidden = (path: string) => boolean
```

##### makeCwdRelPath
Takes an array of strings and `join`s them with `process.cwd()` as the first parameter.

```typescript
const makeCwdRelPath = (...files: Array<string>) => string
```

##### isDirectorySync
Takes a path and returns true if it is a directory.

```typescript
const isDirectorySync = (path: string) => boolean
```

##### readDirectorySync
Takes a path to a directory and returns its contents.

Throws if path does not exist or is not a directory.

```typescript
const readDirectorySync = (path: string) => Array<string>
```

##### makeDirectorySync
Takes a path and attempts to make the directory.

Throws if path already exists.

```typescript
const makeDirectorySync = (path: string) => Void
```

##### importJson
Takes a path to a json file and returns its contents.

Throws if path does not exist or is not a json file (doesn't end with extension .json).

```typescript
const importJson = (path: string) => any
```

##### readFileAsStringSync
Takes a path to a string and returns its contents as a utf-8 string.

Throws if path does not exist or is a directory.

```typescript
const readFileAsStringSync = (path: string) => string
```

##### writeFileAsString
Takes a path and writes the data as a utf-8 string.

Throws if path is a directory.

```typescript
const writeFileAsStringSync = (path: string, data: string) => Void
```

##### doesNotExistError
Takes a path and returns a formatted error.

`Provided path <path> does not exist.`

```typescript
const doesNotExistError = (path: string) => string
```

##### alreadyExistsError
Takes a path and returns a formatted error.

`Provided file/directory already exists: ${path}.`

```typescript
const alreadyExistsError = (path: string) => string
```

##### isNotDirectoryError
Takes a path and returns a formatted error.

`Provided path <path> is not a directory.`

```typescript
const isNotDirectoryError = (path: string) => string
```

##### isDirectoryError
Takes a path and returns a formatted error.

`Provided path <path> is a directory.`

```typescript
const isDirectoryError = (path: string) => string
```

##### isNotJsonFileError
Takes a path and returns a formatted error.

`Provided path <path> is not a json file. Extension must be .json`

```typescript
const isNotJsonFileError = (path: string) => string
```
