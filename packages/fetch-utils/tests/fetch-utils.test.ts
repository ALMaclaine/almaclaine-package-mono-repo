import * as fetchUitls from '../src';

describe('fetch-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(fetchUitls);
        expect(keys.length).toBe(3);
        expect(keys).toMatchSnapshot();
    });
});
