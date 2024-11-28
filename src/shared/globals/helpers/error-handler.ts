import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
    message: string;
    statusCode: number;
    status: string;
    serializeErrors(): IErrorResponse;
}

export interface IError {
    message: string;
    statusCode: number;
    status: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;

    constructor(message: string) {
        super(message);
    }

    serializeErrors(): IError {
        return {
            message: this.message,
            status: this.status,
            statusCode: this.statusCode,
        };
    }
}

export class JoiRequestValidationError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}

export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}

export class NotAuthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}

export class fileTooLargeError extends CustomError {
    statusCode = StatusCodes.REQUEST_TOO_LONG; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}

export class ServerError extends CustomError {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE; // Fixed
    status = 'error';

    constructor(message: string) {
        super(message);
    }
}
