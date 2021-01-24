import * as EmailValidator from "email-validator";

export function validateEmail(email) {
    return EmailValidator.validate(email);
}
