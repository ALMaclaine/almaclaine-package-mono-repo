import {validateEmail as validateEmailBoolean, InvalidEmail} from '@almaclaine/general-utils';
import {ALMError} from "@almaclaine/error-utils";
import {appendFileSync} from "fs";

export const ErrorTypes = {
    MissingQueryParameter: 'MissingQueryParameter',
    MissingBodyProperty: 'MissingBodyProperty'
}

export class MissingQueryParameterError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.MissingQueryParameter);
    }
}

export class MissingBodyPropertyError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.MissingBodyProperty);
    }
}

export function errorHandler(errorSet: Set<String>, unknownErrorLogFilePath: string, knownErrorLogFilePath: string) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            const {error: errorType, message} = error;
            if (errorSet.has(errorType)) {
                console.error(errorType);
                ctx.status = 400;
                ctx.body = {error: message}
            } else {
                ctx.status = 500;
                let errorText;
                errorText = `${new Date()}\n`;
                errorText += error + '\n';
                appendFileSync(unknownErrorLogFilePath, errorText);
                ctx.body = {error: 'Unknown error occurred'};
            }

            let errorText;
            if (error.error) {
                errorText = `${new Date()}\n`;
                errorText += 'Error:\n';
                errorText += error.error + '\n';
                errorText += 'Stack Trace:\n';
                if (error.stacktrace) errorText += error.stacktrace.stack + '\n\n';
            } else {
                errorText = error.stack;
            }
            appendFileSync(knownErrorLogFilePath, errorText);
        }
    }
}

function _allKeysInArray(arr, keys) {
    const values = [];

    for(const key of keys) {
        if(!(key in arr)) {
            values.push(key);
        }
    }

    return {
        truth: values.length === 0,
        values
    }
}

function _anyKeyInArray(arr, keys) {
    return {
        truth: keys.some(e => e in arr),
        values: keys
    }
}

export function validateQueryParamsAll(params) {
    return async function validateParams(ctx, next) {
        const {truth, values} = _allKeysInArray(ctx.request.query, params);
        if(!truth) {
            throw new MissingQueryParameterError(`Missing Query Parameters: ${values.join(', ')}`);
        }
        await next();
    }
}

export function validateQueryParamsAny(params) {
    return async function validateParams(ctx, next) {
        const {truth, values} = _anyKeyInArray(ctx.request.query, params);
        if(!truth) {
            throw new MissingQueryParameterError(`Missing Query Parameters, Must have one of: ${values.join(', ')}`);
        }
        await next();
    }
}

export function validateBodyProps(props) {
    return async function validateProps(ctx, next) {
        const {truth, values} = _allKeysInArray(ctx.request.query, props);
        if(!truth) {
            throw new MissingBodyPropertyError(`Missing Body Properties: ${values.join(', ')}`);
        }
        await next();
    }
}

export function validateEmail(email) {
    if (!validateEmailBoolean(email)) {
        throw new InvalidEmail(`Invalid Email: Must provide valid email.`)
    }
}
