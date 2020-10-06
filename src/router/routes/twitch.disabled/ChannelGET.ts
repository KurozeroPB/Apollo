import express from "express";
import axios from "axios";
import path from "path";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { Response } from "~/types/Response";
import { statusCodes } from "~/utils/utils";

interface Data {
    id: string;
    user_id: string;
    user_name: string;
    game_id: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
}

interface TwitchBody {
    data: Data[];
    pagination: Record<string, any>;
}

interface TwitchAuth {
    access_token: string;
    expires_in: number;
    token_type: string;
}

const getTwitchData = (name: string, token: string): Promise<Data[]> => new Promise((resolve, reject) => {
    axios.get<TwitchBody>("https://api.twitch.tv/helix/streams", {
        params: {
            user_login: name
        },
        headers: {
            "Authorization": `Bearer ${token}`,
            "Client-ID": settings.twitch.id
        }
    }).then((res) => {
        if (res.status >= 200 && res.status <= 299) {
            if (res.data) {
                resolve(res.data.data);
            }
        } else {
            reject(new Error("Unable to authenticate with Twitch API"));
        }
    }).catch((e) => {
        reject(e);
    });
});

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/:channel`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (!req.params.channel) {
                res.status(400).json(statusCodes[400].json);
                return;
            }

            const resp = await axios.post<TwitchAuth>("https://id.twitch.tv/oauth2/token", null, {
                params: {
                    client_id: settings.twitch.id,
                    client_secret: settings.twitch.secret,
                    grant_type: "client_credentials"
                },
                headers: {
                    "Accept": "application/json",
                    "Client-ID": settings.twitch.id
                }
            });

            const token = resp.data.access_token;
            getTwitchData(req.params.channel, token)
                .then((data) => {
                    res.status(200).json(
                        Response({
                            ...statusCodes[200].json,
                            data
                        })
                    );
                }).catch((e) => {
                    res.status(400).json(
                        Response({
                            statusCode: 400,
                            statusMessage: "400 Bad Request",
                            message: e.message
                        })
                    );
                });
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
