import express from "express";
import Base from "../Base";
import Router from "../Router";
import { Response } from "~/types/Response";

export default class extends Base {

    constructor(controller: Router) {
        super({ path: "/", method: "GET", logger: controller.logger, controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(_: express.Request, res: express.Response): Promise<void> {
        res.status(200).json(Response({
            statusCode: 200,
            statusMessage: "OK",
            message: "200 OK",
            data: this.controller.routes.map((route) => `[${route.method}] => /api${route.path}`).sort()
        }));
    }
}
