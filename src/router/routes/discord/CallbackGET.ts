import express from "express";
import path from "path";
import qs from "querystring";
import axios from "axios";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { StringBuilder } from "~/utils/StringBuilder";
import { isEmptyObject, statusCodes } from "~/utils/utils";
import { Response } from "~/types/Response";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/callback`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || origin.indexOf("discord.com") === -1 || origin.indexOf("discordapp.com") === -1) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        if (!req.query.code) {
            res.status(400).json(Response(statusCodes[400].json));
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };

            const requestBody = {
                client_id: settings.discord.clientId,
                client_secret: settings.discord.clientSecret,
                grant_type: "authorization_code",
                code: String(req.query.code),
                redirect_uri: "https://kurozeropb.info/api/v1/discord/callback",
                scope: "identify guilds"
            };

            const response = await axios.post("https://discord.com/api/v6/oauth2/token", qs.stringify(requestBody), config);
            if (isEmptyObject(response)) {
                res.status(500).json(Response(statusCodes[500].json));
                return;
            }

            const { data, status, statusText } = response;
            if (isEmptyObject(data)) {
                res.status(500).json(Response(statusCodes[500].json));
                return;
            } else if (status >= 400) {
                this.logger.error("/discord/callback", statusText);
                res.status(500).json(Response(statusCodes[500].json));
            } else if (!data.access_token) {
                res.status(500).json(Response(statusCodes[500].json));
            }

            res.redirect(StringBuilder.Format("https://jeannebot.com/?token={0}&expires_in={1}", data.access_token, data.expires_in));
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
