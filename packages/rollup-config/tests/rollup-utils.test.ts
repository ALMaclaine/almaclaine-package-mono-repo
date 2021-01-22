import {PackageConfig, ScriptConfig} from '../src';

describe('utils/rollup-utils', () => {
    it('PackageConfig Matches Snapshopt', () => {
        expect(PackageConfig).toMatchSnapshot();
    });

    it('ScriptConfig Matches Snapshopt', () => {
        expect(ScriptConfig).toMatchSnapshot();
    });
})
