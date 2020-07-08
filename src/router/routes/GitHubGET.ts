import express from "express";
import axios from "axios";
import settings from "@/settings";
import Base from "../Base";
import Router from "../Router";
import { Response } from "~/types/Response";
import { statusCodes, foreachAsync } from "~/utils/utils";

export default class extends Base {
    constructor(controller: Router) {
        super({
            path: "/github",
            method: "GET",
            logger: controller.logger,
            controller
        });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<any> {
        // Return if no origin is send
        const origin =
            (req.headers.origin as string) || req.headers.referer || "";
        if (
            !origin ||
            ["https://vdbroek.dev", "https://vdbroek.dev/"].indexOf(origin) ===
                -1
        )
            return res.status(405).json(Response(statusCodes[405].json));

        const headers = {
            headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `token ${settings.api.githubKey}`
            }
        };
        const languages: any = {};
        const array: any[] = [];
        try {
            const response = await axios.get(
                "https://api.github.com/user/repos",
                headers
            );
            await foreachAsync(
                response.data,
                async (repo: any): Promise<void> => {
                    if (repo.language) {
                        const item = array.find(
                            (i): boolean => i.language === repo.language
                        );
                        if (item) item.count++;
                        else array.push({ language: repo.language, count: 1 });
                    }
                }
            );
            await foreachAsync(
                array,
                async (obj: any): Promise<any> =>
                    (languages[obj.language] = obj.count)
            );
            res.status(200).json(
                Response({
                    ...statusCodes[200].json,
                    languages
                })
            );
        } catch (error) {
            if (error.response) {
                this.logger.error(
                    "GitHub",
                    error.response.data.message
                        ? error.response.data.message
                        : error.response.statusText
                );
            } else {
                this.logger.error("GitHub", error);
            }

            res.status(500).json(Response(statusCodes[500].json));
        }
    }
}
