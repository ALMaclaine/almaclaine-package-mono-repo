import * as generalUtils from '../src';

describe('general-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(generalUtils);
        expect(keys.length).toBe(3);
        expect(keys).toMatchSnapshot();
    });
});
