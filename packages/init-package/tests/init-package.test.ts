import * as initPackage from '../src';

describe('utils/fs-utils', () => {
   it('Has Correct API', () => {
       const keys = Object.keys(initPackage);
       expect(keys.length).toBe(1);
       expect(keys).toMatchSnapshot();
   });
});
