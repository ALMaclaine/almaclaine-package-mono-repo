import * as errorUtils from '../src';

describe('error-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(errorUtils);
        expect(keys.length).toBe(1);
        expect(keys).toMatchSnapshot();
    });
});
