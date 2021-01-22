import * as gitUtils from '../src';

describe('utils/git-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(gitUtils);
        expect(keys.length).toBe(1);
        expect(keys).toMatchSnapshot();
    });
});
