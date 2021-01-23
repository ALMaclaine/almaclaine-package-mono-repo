export const doesNotExistError = (path: string): string => `Provided path ${path} does not exist: ${path}.`;

export const alreadyExistsError = (path: string): string => `Provided file/directory already exists: ${path}.`;

export const isNotDirectoryError = (path: string): string => `Provided path ${path} is not a directory.`;

export const isDirectoryError = (path: string): string => `Provided path ${path} is a directory.`;

export const isNotJsonFilError = (path: string): string => `Provided path ${path} is not a json file. Extension must be .json`;

