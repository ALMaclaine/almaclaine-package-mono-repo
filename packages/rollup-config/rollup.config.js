import {
    nodeResolve
} from '@rollup/plugin-node-resolve';
import camelcase from 'camelcase';
import {join} from 'path';
const builtinModules = require('builtin-modules');
const pkg = require(join(process.cwd(), './package.json'));
const external = Object.keys(pkg.dependencies).concat(builtinModules);
const globals = external.reduce((a, c) => {
    a[c] = camelcase(c);
    return a;
}, {});

export default {
    input: 'dist/index.js',
    plugins: [nodeResolve()],
    external: external,
    output: [{
        file: 'dist/index.bundle.js',
        format: 'cjs',
        name: camelcase(pkg.name),
        globals
    }]
};
