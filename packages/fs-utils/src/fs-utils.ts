import {lstatSync, existsSync, readdirSync, readFileSync as fsReadFileSync, writeFileSync, mkdirSync, createReadStream as fsCreateReadStream} from 'fs';
import {join, sep} from 'path';
import {
    alreadyExistsError,
    doesNotExistError,
    isDirectoryError,
    isNotDirectoryError,
    isNotJsonFilError
} from "./errorTemplates";
import {Stream} from "stream";

export {join, resolve} from 'path';
export {existsSync, copyFileSync} from 'fs';

export function isHidden(path: string): boolean {
    const pathSplit = path.split(sep);
    return pathSplit[pathSplit.length - 1][0] === '.';
}

export function createReadStream(path: string): Stream {
    if(!existsSync(path)) {
        throw Error(doesNotExistError(path));
    }

    return fsCreateReadStream(path);
}

export const makeCwdRelPath = (...files: Array<string>): string => join(process.cwd(), ...files);

export function isDirectorySync(path: string): boolean {
    if(!existsSync(path)) return false;
    return lstatSync(path).isDirectory();
}

export function readDirectorySync(path: string): Array<string> {
    if(!isDirectorySync(path)) {
        throw Error(isNotDirectoryError(path));
    }

    return readdirSync(path);
}

export function makeDirectorySync(path: string): void {
    if(existsSync(path)) {
        throw Error(alreadyExistsError(path));
    }
    mkdirSync(path);
}

export function importJson(path: string): any {
    if(!existsSync(path)) {
        throw Error(doesNotExistError(path));
    }

    if(!/.*\.json/.test(path)) {
        throw Error(isNotJsonFilError(path));
    }

    return require(path);
}

export function readFileAsStringSync(path: string): string {
    if(!existsSync(path)) {
        throw Error(doesNotExistError(path));
    }

    if(isDirectorySync(path)) {
        throw Error(isNotDirectoryError(path));
    }

    return fsReadFileSync(path, 'utf-8');
}

export function readFileSync(path: string): Buffer {
    if(!existsSync(path)) {
        throw Error(doesNotExistError(path));
    }

    if(isDirectorySync(path)) {
        throw Error(isNotDirectoryError(path));
    }

    return fsReadFileSync(path);
}

export function writeFileAsStringSync(path: string, data: string): void {
    if(isDirectorySync(path)) {
        throw Error(isDirectoryError(path));
    }

    writeFileSync(path, data, 'utf-8');
}
