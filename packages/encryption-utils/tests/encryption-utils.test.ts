import * as encryptionUtils from '../src';

describe('encryption-utils', () => {
    it('Has Correct API', () => {
        const keys = Object.keys(encryptionUtils);
        expect(keys.length).toBe(2);
        expect(keys).toMatchSnapshot();
    });
});
