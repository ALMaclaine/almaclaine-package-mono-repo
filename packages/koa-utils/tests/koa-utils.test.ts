import * as koaUitls from '../src';

describe('koa-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(koaUitls);
        expect(keys.length).toBe(6);
        expect(keys).toMatchSnapshot();
    });
});
