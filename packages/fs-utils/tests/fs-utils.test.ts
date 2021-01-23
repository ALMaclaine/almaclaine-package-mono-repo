import * as fsUtils from '../src';

describe('utils/fs-utils', () => {
   it('Has Correct API', () => {
       const keys = Object.keys(fsUtils);
       expect(keys.length).toBe(19);
       expect(keys).toMatchSnapshot();
   });
});
