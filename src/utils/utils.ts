import path from "path";
import express from "express";
import Router from "~/router/Router";
import { AxiosError } from "axios";

type ForEachAsyncFN<T> = (value: T, index: number, array: ArrayLike<T>) => Promise<unknown>;

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

export interface ExtendedRequest extends express.Request {
    [x: string]: any;
}

export interface Context {
    path: string;
    method: string;
    controller: Router;
}

export const rfile = /\.(j|t)s$/iu;

export function isAxiosError(error: Error | AxiosError): error is AxiosError {
    return !!(error as AxiosError).response;
}

export function isEmptyObject(o: Record<string, any>): boolean {
    for (const _ in o) {
        return false;
    }
    return true;
}

export function wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

export async function foreachAsync<T = any>(a: ArrayLike<T>, fn: ForEachAsyncFN<T>): Promise<void> {
    for (let i = 0; i < a.length; i++) {
        await fn(a[i], i, a);
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
            message: "The request could not be understood by the server due to malformed syntax"
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
            message: "The server has not found anything matching the Request-URI"
        },
        file: path.join(__dirname, "..", "static/errors/404.html")
    },
    405: {
        json: {
            statusCode: 405,
            statusMessage: "405 Method Not Allowed",
            message: "The method specified in the Request-Line is not allowed for the resource identified by the Request-URI"
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
            message: "The server encountered an unexpected condition which prevented it from fulfilling the request"
        },
        file: path.join(__dirname, "..", "static/errors/500.html")
    }
};
