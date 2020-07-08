import express from "express";
import Base from "../Base";
import Router from "../Router";
import { Response } from "~/types/Response";
import { statusCodes } from "~/utils/utils";

export default class extends Base {
    constructor(controller: Router) {
        super({
            path: "/",
            method: "GET",
            logger: controller.logger,
            controller
        });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(_: express.Request, res: express.Response): Promise<void> {
        res.status(200).json(
            Response({
                ...statusCodes[200].json,
                data: this.controller.routes
                    .map((route) => `[${route.method}] => /api${route.path}`)
                    .sort()
            })
        );
    }
}
