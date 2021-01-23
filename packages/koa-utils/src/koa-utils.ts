import {appendFileSync} from "fs";

export const Errors = {
    MissingQueryParameter: 'MissingQueryParameter',
    MissingBodyProperty: 'MissingBodyProperty'
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

export function createError(error, message) {
    return {
        stacktrace: new Error(error),
        message,
        error
    }
}

function _allKeysInArray(arr, keys, err) {
    const missing = [];

    for(const key of keys) {
        if(!(key in arr)) {
            missing.push(key);
        }
    }

    if(missing.length > 0) {
        throw createError(err,`${err}. Missing: ${missing.join(', ')}`);
    }
}

function _anyKeyInArray(arr, keys, err) {
    if(!keys.some(e => e in arr)) throw createError(err,`${err}. Must have one of: ${keys.join(', ')}`);
}

export function validateQueryParamsAll(params) {
    return async function validateParams(ctx, next) {
        _allKeysInArray(ctx.request.query, params, Errors.MissingQueryParameter);
        await next();
    }
}

export function validateQueryParamsAny(params) {
    return async function validateParams(ctx, next) {
        _anyKeyInArray(ctx.request.query, params, Errors.MissingQueryParameter);
        await next();
    }
}

export function validateBodyProps(props) {
    return async function validateProps(ctx, next) {
        _allKeysInArray(ctx.request.body, props, Errors.MissingBodyProperty);
        await next();
    }
}
