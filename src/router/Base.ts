import express from "express";
import Router from "./Router";
import Logger from "~/utils/logger";
import { Context } from "~/utils/utils";

abstract class Base {
    path: string;
    method: string;
    controller: Router;
    logger: Logger;

    constructor(ctx: Context) {
        this.path = ctx.path;
        this.method = ctx.method;
        this.controller = ctx.controller;
        this.logger = ctx.logger;
    }

    abstract async run(req: express.Request, res: express.Response): Promise<unknown>;
}

export default Base;
