import {hash, compare} from 'bcrypt';

export async function encryptPassword(password: string, rounds: number = 64000) {
    return hash(password, rounds);
}

export async function comparePassword(providedPassword: string, actualPassword: string) {
    return compare(providedPassword, actualPassword);
}
