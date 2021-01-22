const mysql = require('mysql2/promise');

const connectionInfo = {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PW
};

(async () => {
    const connection = await mysql.createConnection(connectionInfo);
    await connection.execute('CREATE DATABASE IF NOT EXISTS spinglobal_mysql_utils_test_db');

    const connection2 = await mysql.createConnection({...connectionInfo, database: 'spinglobal_mysql_utils_test_db'});
    const tableQry = `CREATE TABLE IF NOT EXISTS Table1 (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
firstname VARCHAR(30) NOT NULL,
lastname VARCHAR(30) NOT NULL
);`

    await connection2.execute(tableQry);

    const addItemQry = `INSERT INTO Table1 (firstname, lastname) VALUES ("Name1", "Name2")`;
    await connection2.execute(addItemQry);

    connection.destroy();
    connection2.destroy();
})()
