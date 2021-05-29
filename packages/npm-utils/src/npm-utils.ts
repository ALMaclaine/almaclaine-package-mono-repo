import {
    alreadyExistsError,
    existsSync,
    join,
    makeCwdRelPath,
    writeFileAsStringSync,
} from '@almaclaine/fs-utils';

import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import util from 'util';
const question: (str: string) => Promise<string> = util.promisify(rl.question).bind(rl);

import validPackage from "validate-npm-package-name";

import {unlinkSync} from "fs";

import {execSync} from "child_process";

const execSyncToString = (cmd: string) => execSync(cmd).toString('utf-8').trim();

export async function initPackage(folderName: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (!validPackage(folderName)) {
        throw Error('Package name must be in the form of word(-word)*.');
    }
    const dirPath = makeCwdRelPath(folderName);

    execSyncToString(`npx degit almaclaine/typescript-package-template ${dirPath}`);

    if (!existsSync(dirPath)) {
        throw Error(`Failed to create directory: ${folderName}.\n${alreadyExistsError(dirPath)}.`);
    }

    unlinkSync(join(dirPath, 'src', 'postgres-utils.ts'));
    writeFileAsStringSync(join(dirPath, 'src', `${folderName}.ts`), '');

    unlinkSync(join(dirPath, 'tests', 'typescript-package-template.test.ts'));
    writeFileAsStringSync(join(dirPath, 'tests', `${folderName}.test.ts`), '');

    const desc: tring = await question('Enter a description for the package: ');
    const author = await question('Package Author: ');
    const keywords = await question('Enter package keywords separated by space: ');
    const git = await question('Github url (no .git, optional): ');

    const pack = require(join(dirPath, 'package.json'));
    pack.name = `${folderName}`;
    pack.description = desc;
    pack.author = `${author.trim()}`;
    if (git) {
        pack.repository.url = git + '.git';
        pack.bugs.url = git + '/issues';
        pack.homepage = git;
        execSync(`cd ${dirPath}; git init; git remote add origin ${git}.git`);
    }

    // Capitalize first letter of each Keyword, Don't Allow Duplicates
    pack.keywords = [...new Set(keywords.trim()
        .replace(/\s\s+/g, ' ')
        .split(' ')
        .map(e => e.toLowerCase())
        .map(e => e[0].toUpperCase() + e.slice(1)))];
    writeFileAsStringSync(join(dirPath, 'package.json'), JSON.stringify(pack, null, 2));
    rl.close();
}
