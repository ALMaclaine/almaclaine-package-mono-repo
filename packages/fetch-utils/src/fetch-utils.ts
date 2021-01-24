const fetch = require('cross-fetch');
import {ALMError} from "@almaclaine/error-utils";

export const ErrorTypes = {
    FetchFailed: 'FetchFailed'
}

export class FetchFailedError extends ALMError {
    constructor(message: string) {
        super(message, ErrorTypes.FetchFailed);
    }
}

export async function almFetch(url: string, options: {[key: string]: any} = {}) {
    const res = await fetch(url, options);
    if(!res.ok) {
        throw new FetchFailedError(`Fetch failed with status code: ${res.status}`);
    }
    return res;
}
