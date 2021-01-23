import {ConnectionManager} from './ConnectionManager';
import {ConnectionInfo} from './types';
import * as EmailValidator from "email-validator";

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

export async function setupDatabase(dbInfo: ConnectionInfo, dbDefaultName: string, tableQueries: string[]) {
    if (!dbInfo.host) throw new Error('Must provide host name');
    if (!dbInfo.password)
        throw new Error('Must provide password (environment variable recommended)');
    if (!dbInfo.user) throw new Error('Must provide user');

    const database = dbInfo.database || dbDefaultName;
    await execute(
        { ...dbInfo, database: '' },
        `CREATE DATABASE IF NOT EXISTS ${database};`,
    );

    for(const queries of tableQueries) {
        await execute({ ...dbInfo, database }, queries);
    }

    execute.destroyConnections();
}

export async function idExistsInTable(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `SELECT id FROM ${table} WHERE id = ? LIMIT 1;`;
    return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function getFromTable<T extends object>(dbInfo: ConnectionInfo, table: string, id: string) {
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

export async function deleteFromTable(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `DELETE FROM ${table} WHERE id=?`;
    await execute(dbInfo, sql, [id]);
}

export function validateEmail(email) {
    return EmailValidator.validate(email);
}
