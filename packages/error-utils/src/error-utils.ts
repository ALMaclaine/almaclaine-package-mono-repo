export class ALMError extends Error {
    constructor(message: string, public readonly type: string) {
        super(message);
    }
}
