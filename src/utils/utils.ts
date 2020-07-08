import path from "path";
import Router from "~/router/Router";
import Logger from "./logger";

type ForEachFunction = (
    value: any,
    index: number,
    array: ArrayLike<any>
) => Promise<unknown>;

type ForInFunction = (
    value: any,
    index: string,
    object: Record<string, any>
) => Promise<unknown>;

type Codes = 200 | 400 | 403 | 404 | 405 | 429 | 500;

interface StatusCode {
    json: {
        statusCode: number;
        statusMessage: string;
        message: string;
    };
    file?: string;
}

type StatusCodes = {
    [T in Codes]: StatusCode;
};

export interface Context {
    path: string;
    method: string;
    controller: Router;
    logger: Logger;
}

export const rfile = /^.+\.(j|t)s$/iu;

/** An async forEach function */
export async function foreachAsync(
    a: ArrayLike<any>,
    fn: ForEachFunction
): Promise<void> {
    for (let i = 0; i < a.length; i++) {
        await fn(a[i], i, a);
    }
}

/** Wrapper around for-in loop to make it async */
export async function forinAsync(
    o: Record<string, any>,
    fn: ForInFunction
): Promise<void> {
    for (const i in o) {
        if (o.hasOwnProperty(i)) {
            await fn(o[i], i, o);
        }
    }
}

export const statusCodes: StatusCodes = {
    200: {
        json: {
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded"
        }
    },
    400: {
        json: {
            statusCode: 400,
            statusMessage: "400 Bad Request",
            message:
                "The request could not be understood by the server due to malformed syntax"
        },
        file: path.join(__dirname, "..", "static/errors/400.html")
    },
    403: {
        json: {
            statusCode: 403,
            statusMessage: "403 Forbidden",
            message: "Invalid credentials sent"
        }
    },
    404: {
        json: {
            statusCode: 404,
            statusMessage: "404 Not Found",
            message:
                "The server has not found anything matching the Request-URI"
        },
        file: path.join(__dirname, "..", "static/errors/404.html")
    },
    405: {
        json: {
            statusCode: 405,
            statusMessage: "405 Method Not Allowed",
            message:
                "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI"
        }
    },
    429: {
        json: {
            statusCode: 429,
            statusMessage: "429 Too Many Requests",
            message: "owo you hit the ratelimit, please calm down!"
        }
    },
    500: {
        json: {
            statusCode: 500,
            statusMessage: "500 Internal Server Error",
            message:
                "The server encountered an unexpected condition which prevented it from fulfilling the request"
        },
        file: path.join(__dirname, "..", "static/errors/500.html")
    }
};
