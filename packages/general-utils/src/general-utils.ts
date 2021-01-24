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
