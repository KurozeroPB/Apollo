import express from "express";
import path from "path";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { statusCodes } from "~/utils/utils";
import { Response } from "~/types/Response";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/:type`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || origin.indexOf("jeannebot.com") === -1) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        try {
            if (!req.params.type) {
                res.status(400).json(statusCodes[400].json);
                return;
            }

            const allowed = ["commands", "features", "settings"];
            if (allowed.indexOf(String(req.params.type)) === -1) {
                res.status(400).json(Response(statusCodes[400].json));
                return;
            }

            const { Jeanne } = this.database;
            let data = [];
            switch (req.params.type) {
                default:
                case "commands":
                    data = await Jeanne.Commands.find({}).exec();
                    break;
                case "features":
                    data = await Jeanne.Features.find({}).exec();
                    break;
                case "settings":
                    data = await Jeanne.Settings.find({}).exec();
                    break;
            }

            res.status(200).json(
                Response({
                    ...statusCodes[200].json,
                    data
                })
            );
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
