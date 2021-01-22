import {ConnectionManager} from './ConnectionManager';
import {ConnectionInfo} from './types';

async function execute(connectionInfo: ConnectionInfo, sql: string, args: Array<any> = []): Promise<Array<object>> {
    const connection = await ConnectionManager.get(connectionInfo);
    let rows;
    if(args.length > 0) {
        [rows] = await connection.execute(sql, args);
    } else {
        [rows] = await connection.execute(sql);
    }
    return rows;
}

execute.destroyConnections = ConnectionManager.destroy;

export {execute};
