import {ConnectionManager} from './ConnectionManager';
import {ConnectionInfo} from './types';
import {ALMError} from '@almaclaine/error-utils';
import {promises as fs, existsSync, readFileSync} from 'fs';

import {join} from 'path';
const pkgDir = require("pkg-dir");

export const ErrorTypes = {
    MysqlMissingHostName: 'MysqlMissingHostName',
    MysqlMissingPassword: 'MysqlMissingPassword',
    MysqlMissingUser: 'MysqlMissingUser'
}

export class MysqlMissingHostNameError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.MysqlMissingHostName);
    }
}

export class MysqlMissingPasswordError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.MysqlMissingPassword);
    }
}

export class MysqlMissingUserError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.MysqlMissingUser);
    }
}

async function execute(connectionInfo: ConnectionInfo, sql: string, args: Array<any> = []): Promise<Array<object>> {
    const connection = await ConnectionManager.get(connectionInfo);
    let rows;
    if (args.length > 0) {
        [rows] = await connection.execute(sql, args);
    } else {
        [rows] = await connection.query(sql);
    }
    return rows;
}

execute.destroyConnections = ConnectionManager.destroy;

export {execute};

export function validateConnectionInfo(dbInfo: ConnectionInfo) {
    if (!dbInfo.host) throw new MysqlMissingHostNameError('Must provide host name');
    if (!dbInfo.password)
        throw new MysqlMissingPasswordError('Must provide password (environment variable recommended)');
    if (!dbInfo.user) throw new MysqlMissingUserError('Must provide user');
}

export async function setupDatabase(dbInfo: ConnectionInfo, dbDefaultName: string, tableQueries: string[]) {
    validateConnectionInfo(dbInfo);
    const database = dbInfo.database || dbDefaultName;
    await execute(
        {...dbInfo, database: ''},
        `CREATE DATABASE IF NOT EXISTS ${database};`
    );

    for (const queries of tableQueries) {
        await execute({...dbInfo, database}, queries);
    }

    execute.destroyConnections();
}

export async function checkExists(objs: object[]) {
    return objs.length === 1;
}

export async function getOneOrDefault<T>(objs: object[], def: T) {
    return (objs[0] as unknown) as T || def;
}

export async function getListOrDefault<T>(objs: object[], def: T[]) {
    return (objs as unknown) as T[] || def;
}

export async function readSQLTableFiles(dir: string) {
    const makePath = async (file = '') => join(await pkgDir(dir), 'sql', 'table', file);
    const tablePath = await makePath();
    const dirFiles = existsSync(tablePath) ? await fs.readdir(tablePath) : [];
    const sqlFiles = dirFiles.filter(e => /.+\.sql/.test(e));
    return await Promise.all(sqlFiles.map(async e => await fs.readFile(await makePath(e), 'utf-8')));
}

export function readQuery(dir: string, file: string) {
    return readFileSync(join(pkgDir.sync(dir), 'sql', 'query', file), 'utf-8');
}
