import express from "express";
import crypto from "crypto";
import axios from "axios";
import Eris from "eris";
import settings from "@/settings";
import Base from "../Base";
import Router from "../Router";
import { Response } from "~/types/Response";
import { statusCodes, ExtendedRequest } from "~/utils/utils";

const client = Eris("");

export default class extends Base {
    constructor(controller: Router) {
        super({ path: "/patreon", method: "POST", logger: controller.logger, controller });
        this.controller.router.post(this.path, this.run.bind(this));
    }

    async run(req: ExtendedRequest, res: express.Response): Promise<void> {
        // https://docs.patreon.com/#webhooks
        const trigger = req.headers["x-patreon-event"];
        const hash = req.headers["x-patreon-signature"];
        const hmac = crypto.createHmac("md5", settings.patreon.secret);
        hmac.update(req.rawBody);
        const crypted = hmac.digest("hex");
        if (crypted !== hash) {
            res.status(403).json(statusCodes[403].json);
            return;
        }

        const data = req.body.data;
        const resp = await axios.get(data.relationships.patron.links.related);
        const patron = resp.data.data;
        const cents = data.attributes.amount_cents;
        const dollars = cents / 100;
        const amount = dollars.toLocaleString("en-US", { style: "currency", currency: "USD" });

        switch (trigger) {
            case "pledges:create": {
                await client.executeWebhook(settings.patreon.webhook.id, settings.patreon.webhook.token, {
                    embeds: [
                        {
                            author: {
                                name: `${patron.attributes.first_name} pledged on Patreon!`,
                                url: `https://www.patreon.com/user?u=${patron.id}`,
                                icon_url: patron.attributes.image_url
                            },
                            description: `[Kurozero's Patreon](https://www.patreon.com/Kurozero)\n${patron.attributes.first_name} pledged ${amount} to Kurozero on Patreon`,
                            color: 0xf96854,
                            timestamp: data.attributes.created_at
                        }
                    ]
                });
                break;
            }
            case "pledges:update": {
                await client.executeWebhook(settings.patreon.webhook.id, settings.patreon.webhook.token, {
                    embeds: [
                        {
                            author: {
                                name: `${patron.attributes.first_name} updated their pledge`,
                                url: `https://www.patreon.com/user?u=${patron.id}`,
                                icon_url: patron.attributes.image_url
                            },
                            description: `[Kurozero's Patreon](https://www.patreon.com/Kurozero)\nThey are now pledging ${amount}`,
                            color: 0xf96854,
                            timestamp: data.attributes.created_at
                        }
                    ]
                });
                break;
            }
            case "pledges:delete": {
                await client.executeWebhook(settings.patreon.webhook.id, settings.patreon.webhook.token, {
                    embeds: [
                        {
                            author: {
                                name: `${patron.attributes.first_name} deleted a pledge`,
                                url: `https://www.patreon.com/user?u=${patron.id}`,
                                icon_url: patron.attributes.image_url
                            },
                            description: `[Kurozero's Patreon](https://www.patreon.com/Kurozero)\nPledge of ${amount} deleted`,
                            color: 0xf96854,
                            timestamp: data.attributes.created_at
                        }
                    ]
                });
                break;
            }
            default: {
                await client.executeWebhook(settings.patreon.webhook.id, settings.patreon.webhook.token, {
                    embeds: [
                        {
                            author: { name: "Unkown patreon request", url: "", icon_url: "" },
                            color: 0xf96854
                        }
                    ]
                });
                break;
            }
        }
        res.status(200).json(Response(statusCodes[200].json));
    }
}
