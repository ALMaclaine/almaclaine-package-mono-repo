import {initPackage} from '@almaclaine/npm-utils';

// TODO: Consider moving into separate package.
const errorExit = (err) => {
    console.error(err);
    process.exit(1);
}

export function initPackageCli() {
    const folderName: string = process.argv[2];
    if (!folderName) errorExit('Must pass an argument for package name as first parameter.');
    try {
        initPackage(folderName);
    } catch(e) {
        errorExit(e.message);
    }
}
