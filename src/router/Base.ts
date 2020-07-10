import express from "express";
import Router from "./Router";
import Logger from "~/utils/Logger";
import { Response } from "~/types/Response";
import { AxiosError } from "axios";
import { Context, statusCodes, isAxiosError } from "~/utils/utils";
import Database from "~/utils/Database";

abstract class Base {
    database: Database;
    path: string;
    method: string;
    controller: Router;
    logger: Logger;

    constructor(ctx: Context) {
        this.database = ctx.controller.database;
        this.path = ctx.path;
        this.method = ctx.method;
        this.controller = ctx.controller;
        this.logger = ctx.controller.logger;
    }

    abstract async run(req: express.Request, res: express.Response): Promise<unknown>;

    handleException(res: express.Response, error: Error | AxiosError): void {
        let message = "";
        if (isAxiosError(error)) {
            message = error.response?.data?.message ? error.response?.data?.message : error.response?.statusText || "Unknown Error";
        } else {
            message = error.message ? error.message : error.toString();
        }

        this.logger.error("GitHub", message);
        res.status(500).json(
            Response({
                ...statusCodes[500].json,
                error: message
            })
        );
    }
}

export default Base;
