export interface ConnectionInfo {
    host: string;
    user: string;
    database: string;
    password: string;
    waitForConnections?: boolean;
    connectionLimit?: number;
    queueLimit?: number;
}
