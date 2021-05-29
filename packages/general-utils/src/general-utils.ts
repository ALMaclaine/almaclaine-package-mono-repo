import {validate} from "email-validator";
import {ALMError} from "@almaclaine/error-utils";

export const ErrorTypes = {
    InvalidEmail: 'InvalidEmail'
};

export class InvalidEmail extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.InvalidEmail);
    }
}

export function validateEmail(email: string) {
    return validate(email);
}

export function makeId(idLength: number = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = characters.length;
    for (let i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * len));
    }
    return result;
}

export function isMainProcess(filename: string) {
    if(require.main) {
        return require.main.filename === filename;
    } else {
        return false;
    }
}

export function timeNowString() {
    const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - timeZoneOffset)).toISOString().slice(0, -1);
}
