import express from "express";
import path from "path";
import axios from "axios";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { statusCodes, foreachAsync, wait } from "~/utils/utils";
import { Response } from "~/types/Response";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/donators`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        const origin = req.headers.origin || req.headers.referer;
        if (!origin || origin.indexOf("jeannebot.com") === -1) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        const headers = {
            headers: {
                Accept: "application/json",
                Authorization: `Bot ${settings.discord.jeanne}`
            }
        };
        try {
            const donators = await this.database.Jeanne.Users.find({ donator: true }).exec();
            const donatorIDs = donators.map((x) => x.id);
            const donatorsData = [];

            let retryAfter = 0;
            let missingDonator = null;

            await foreachAsync(donatorIDs, async (donator: string) => {
                await wait(retryAfter);
                retryAfter = 0;

                const response = await axios.get(`https://discord.com/api/users/${donator}`, headers);
                if (response.headers["X-RateLimit-Remaining"] === 0) {
                    missingDonator = donator;
                    retryAfter = response.headers["Retry-After"];
                } else {
                    donatorsData.push(response.data);
                }
            });

            if (missingDonator) {
                await wait(retryAfter);
                const response = await axios.get(`https://discord.com/api/users/${missingDonator}`, headers);
                donatorsData.push(response.data);
            }

            res.status(200).json(
                Response({
                    ...statusCodes[200].json,
                    donatorsData
                })
            );
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
