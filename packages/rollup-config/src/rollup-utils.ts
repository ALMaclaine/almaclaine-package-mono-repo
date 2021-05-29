import {
    nodeResolve
} from '@rollup/plugin-node-resolve';
import {join} from 'path';
import camelcase from 'camelcase';
import * as fs from "fs";
const builtinModules = [
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "timers",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "zlib"
];

const {name, dependencies, peerDependencies} = JSON.parse(fs.readFileSync(join(process.cwd(), './package.json'), 'utf-8'));

const external = Object.keys({...dependencies, ...peerDependencies}).concat(builtinModules);
const globals = external.reduce((a: {[key: string]: string}, c: string) => {
    a[c] = camelcase(c);
    return a;
}, {});

function generateOutput(file: string, outName: string) {
    return {
        file: `dist/${file}.bundle.js`,
        format: 'cjs',
        name: camelcase(outName),
        globals
    };
}

export const PackageConfig = {
    input: 'dist/index.js',
    plugins: [nodeResolve()],
    external,
    output: [generateOutput('index', name)]
};

export const ScriptConfig = {
    ...PackageConfig,
    input: 'dist/exec.js',
    output: [
        ...PackageConfig.output,
        generateOutput('exec', name)
    ]
};
