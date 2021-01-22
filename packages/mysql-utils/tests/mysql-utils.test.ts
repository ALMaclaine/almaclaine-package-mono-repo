import {execute} from "../src";
import {dbConfig} from "../src/dbConfig";

describe('utils/mysql-utils', function () {
    it('mysql-utils', async () => {
        const res = await execute(dbConfig, 'SELECT * FROM Table1 where id = 1');
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(1);
        const obj = res[0];
        expect(typeof obj).toBe('object');
        expect(obj['id']).toBe(1);
        expect(obj['firstname']).toBe('Name1');
        expect(obj['lastname']).toBe('Name2');

        const res2 = await execute(dbConfig, 'SELECT * FROM Table1 where id = ?', [1]);
        expect(Array.isArray(res2)).toBe(true);
        expect(res2.length).toBe(1);
        const obj2 = res2[0];
        expect(typeof obj2).toBe('object');
        expect(obj2['id']).toBe(1);
        expect(obj2['firstname']).toBe('Name1');
        expect(obj2['lastname']).toBe('Name2');
        execute.destroyConnections();
    });
});
