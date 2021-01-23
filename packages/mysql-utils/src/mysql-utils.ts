import {ConnectionManager} from './ConnectionManager';
import {ConnectionInfo} from './types';

function makeId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * len));
    }
    return result;
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

export async function idExistsInTable(dbInfo: ConnectionInfo, table: string, id: string) {
    const sql = `SELECT id FROM ${table} WHERE id = ? LIMIT 1;`;
    return (await execute(dbInfo, sql, [id])).length === 1;
}

export async function addToTable(dbInfo: ConnectionInfo, table: string, setName: string) {
    const sql = `INSERT INTO ${table} (id, name) VALUES (?, ?);`;
    let id = makeId();
    while (await idExistsInTable(dbInfo, table, id)) id = makeId();
    await execute(dbInfo, sql, [id, setName]);
    return id;
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
