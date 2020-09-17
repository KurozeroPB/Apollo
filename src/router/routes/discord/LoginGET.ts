import express from "express";
import path from "path";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { StringBuilder } from "~/utils/StringBuilder";
import { statusCodes } from "~/utils/utils";
import { Response } from "~/types/Response";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/login`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || origin.indexOf("jeannebot.com") === -1) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        try {
            const redirect = encodeURIComponent("https://kurozeropb.info/api/discord/callback");
            res.redirect(
                StringBuilder.Format(
                    "https://discord.com/oauth2/authorize?response_type=code&redirect_uri={0}&scope=identify%20guilds&client_id={1}",
                    redirect,
                    settings.discord.id
                )
            );
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
