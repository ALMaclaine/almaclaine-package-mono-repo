const {createConnection, createPool} = require('mysql2/promise');
import {ConnectionInfo} from "./types";

export class ConnectionManager {
    // @ts-ignore
    private static connectionMap = new Map();

    static async get(connectionInfo: ConnectionInfo) {
        const conMap = ConnectionManager.connectionMap;
        if (!conMap.has(connectionInfo)) {
            if (connectionInfo.connectionLimit !== null) {
                const {queueLimit, waitForConnections} = connectionInfo;
                const newPool = await createPool({
                    ...connectionInfo,
                    waitForConnections: waitForConnections || true,
                    queueLimit: queueLimit || 0
                });
                conMap.set(connectionInfo, newPool);
            } else {
                const newConnection = await createConnection(connectionInfo);
                conMap.set(connectionInfo, newConnection);
            }
        }
        return conMap.get(connectionInfo);
    }

    static destroy() {
        for(const connection of ConnectionManager.connectionMap) {
            connection[1].end()
        }
    }
}

process.once('SIGTERM', () => {
    ConnectionManager.destroy();
});
