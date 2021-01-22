import {execSync} from 'child_process';

export function commitPackage(pack: string, desc: string): void {
    console.log(`Committing Project: ${pack}.`)
    const stripped = desc.replace(/"/g, '');
    let out = execSync('git add .').toString('utf-8').trim();
    console.log(out);
    out = execSync(`git commit -m "${pack}: ${stripped}."`).toString('utf-8').trim();
    console.log(out);
}
