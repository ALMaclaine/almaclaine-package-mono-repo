import * as EmailValidator from "email-validator";
import {ALMError} from "@almaclaine/error-utils";

export const ErrorTypes = {
    InvalidEmail: 'InvalidEmail'
}

export class InvalidEmail extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.InvalidEmail);
    }
}

export function validateEmail(email) {
    return EmailValidator.validate(email);
}

export function makeId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const len = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * len));
    }
    return result;
}
