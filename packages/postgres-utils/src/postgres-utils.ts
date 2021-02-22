import {ConnectionInfo} from "./types";
import {ConnectionManager} from "./ConnectionManager";
import {sql, SQLQuery} from "@databases/pg";

async function execute(connectionInfo: ConnectionInfo, sql: SQLQuery): Promise<Array<object>> {
    const connection = await ConnectionManager.get(connectionInfo);
    return await connection.query(sql);
}

execute.destroyConnections = ConnectionManager.destroy;

export {execute};

export async function setupDatabase(dbInfo: ConnectionInfo, dbDefaultName: string, tableQueries: SQLQuery[]) {
    const database = dbInfo.database || dbDefaultName;
    await execute(
        {...dbInfo, database: ''},
        sql`CREATE DATABASE IF NOT EXISTS ${database};`
    );

    for (const query of tableQueries) {
        await execute({...dbInfo, database}, query);
    }
}

export async function getOneOrDefault<T>(objs: object[], def: T) {
    return (objs[0] as unknown) as T || def;
}

export async function getListOrDefault<T>(objs: object[], def: T[]) {
    return (objs as unknown) as T[] || def;
}
