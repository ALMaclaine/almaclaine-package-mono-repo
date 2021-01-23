import * as npmUtils from '../src';

describe('utils/npm-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(npmUtils);
        expect(keys.length).toBe(1);
        expect(keys).toMatchSnapshot();
    });
});
