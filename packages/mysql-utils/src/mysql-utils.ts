import {ConnectionManager} from './ConnectionManager';
import {ConnectionInfo} from './types';
import {ALMError} from '@almaclaine/error-utils';
import {promises as fs} from 'fs';
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
        [rows] = await connection.execute(sql);
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

export async function idExistsInTable(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `SELECT id FROM ${table} WHERE id = ? LIMIT 1;`;
    return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function getFromTableById<T extends object>(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `SELECT * FROM ${table} WHERE id = ? LIMIT 1`;
    return ((await execute(dbInfo, sql, [id]))[0] as T) || null;
}

export async function listFromTable<T extends object>(
    dbInfo: ConnectionInfo,
    table: string,
    page = 0,
    limit = 20,
) {
    const sql = `SELECT * FROM ${table} LIMIT ? OFFSET ?`;
    const offset = `${limit * page}`;
    return (
        ((await execute(dbInfo, sql, [`${limit}`, offset])) as T[]) || []
    );
}

export async function deleteFromTableById(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `DELETE FROM ${table} WHERE id=?`;
    await execute(dbInfo, sql, [id]);
}

export async function readSQLFiles(dir: string = 'sql') {
    const makePath = async (file = '') => join(await pkgDir(__dirname), 'src', dir, file);
    const dirFiles = await fs.readdir(await makePath());
    const sqlFiles = dirFiles.filter(e => /.+\.sql/.test(e));
    return await Promise.all(sqlFiles.map(async e => await fs.readFile(await makePath(e), 'utf-8')));
}
