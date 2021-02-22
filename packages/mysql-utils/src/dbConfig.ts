import {ConnectionInfo} from "./types";

export const dbConfig: ConnectionInfo = {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PW,
    database: 'mysql_utils_test_db'
};
