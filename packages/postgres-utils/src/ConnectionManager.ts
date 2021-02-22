import {ConnectionInfo} from "./types";
const createConnectionPool = require('@databases/pg');

export class ConnectionManager {
    // @ts-ignore
    private static connectionMap = new Map();

    static async get(connectionInfo: ConnectionInfo) {
        const conMap = ConnectionManager.connectionMap;
        if (!conMap.has(connectionInfo)) {
            const connectionString = `postgres://${connectionInfo.user}@${connectionInfo.host}/${connectionInfo.database}`;
            conMap.set(connectionInfo, createConnectionPool(
                connectionString
            ));
        }
        return conMap.get(connectionInfo);
    }

    static async destroy() {
        for (const [_, connection] of ConnectionManager.connectionMap) {
            await connection.dispose();
        }
    }
}

process.once('SIGTERM', async () => {
    await ConnectionManager.destroy();
});
