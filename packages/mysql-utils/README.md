# mysql-utils

Utilities for working with mysql.

## API

### Listing

### Functions

- getRows

### Types

- ConnectionInfo

### Details

#### Functions

##### getRows

Takes a `ConnectionInfo` and sql `string. Creates a new connection from `ConnectionInfo` if one doesn't
exist already.

Returns a promise of the results of calling the `sql` value on the database provided in `ConnectionInfo`.

#### Types

##### ConnectionInfo

Contains the information to create a mysql connection.

```typescript
interface ConnectionInfo {
    host: string,
    user: string,
    database: string,
    password: string
}
```
