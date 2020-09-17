import express from "express";
import path from "path";
import axios from "axios";
import qs from "querystring";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { statusCodes } from "~/utils/utils";
import { Response } from "~/types/Response";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/revoke`, method: "POST", controller });
        this.controller.router.post(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || origin.indexOf("jeannebot.com") === -1) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        if (!req.query.token) {
            res.status(400).json(Response(statusCodes[400].json));
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${Buffer.from(`${settings.discord.id}:${settings.discord.secret}`, "binary").toString("base64")}`
                }
            };

            await axios.post("https://discord.com/api/v6/oauth2/token/revoke", qs.stringify({ token: String(req.query.token) }), config);

            res.status(200).json(Response(statusCodes[200].json));
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
