import express from "express";
import path from "path";
import axios from "axios";
import drawMultilineText from "canvas-multiline-text";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import { Canvas, Image } from "canvas";
import { statusCodes } from "~/utils/utils";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/profile`, method: "POST", controller });
        this.controller.router.post(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        try {
            const token = req.headers.authorization;
            if (!token || token !== settings.discord.jeanne) {
                res.status(403).json(statusCodes[403].json);
                return;
            }

            const username = req.body.username;
            const avatarUrl = req.body.avatar;
            const level = req.body.level;
            const points = req.body.points;
            const about = req.body.about;
            const size = req.body.size;
            const background = req.body.background;

            const large = path.join(__dirname, "..", "..", "..", "assets", "images", "profile-card_360x260.png");
            const small = path.join(__dirname, "..", "..", "..", "assets", "images", "profile-card_210x140.png");

            const image = new Image();
            image.src = size === "large" ? large : small;

            const avatarResp = await axios.get(avatarUrl, { responseType: "arraybuffer" });
            const avatar = new Image();
            avatar.src = avatarResp.data;
            const bgResp = await axios.get(background, { responseType: "arraybuffer" });
            const bg = new Image();
            bg.src = bgResp.data;

            const canvas = new Canvas(image.width, image.height);
            const ctx = canvas.getContext("2d");

            switch (size) {
                case "large":
                    ctx.drawImage(bg, 5, 5, 350, 250);
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    ctx.drawImage(avatar, image.width / 14, image.height / 3.78, 90, 90);

                    ctx.font = "24px Exo2-Black";
                    ctx.fillStyle = "white";
                    ctx.fillText(username, image.width / 12.5, image.height / 5.8);

                    ctx.font = "12px Exo2-Medium";
                    ctx.fillText(`Points: ${points}`, image.width / 2.55, image.height / 2.8);
                    ctx.fillText(`Level: ${level}`, image.width / 2.55, image.height / 2.3);

                    drawMultilineText(ctx, about, {
                        rect: {
                            x: image.width / 12.5,
                            y: image.height / 1.47,
                            width: canvas.width - 20,
                            height: canvas.height - 20
                        },
                        font: "Exo2-Medium",
                        lineHeight: 0,
                        minFontSize: 12,
                        maxFontSize: 12
                    });
                    break;
                case "small":
                default:
                    ctx.drawImage(bg, 5, 5, 200, 130);
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    ctx.drawImage(avatar, image.width / 20, image.height / 12, 60, 60);

                    ctx.font = "18px Exo2-Black";
                    ctx.fillStyle = "white";
                    ctx.fillText(username, image.width / 1.93, image.height / 5.2);

                    ctx.font = "12px Exo2-Medium";
                    ctx.fillText(`Points: ${points}`, image.width / 15, image.height / 1.38);
                    ctx.fillText(`Level: ${level}`, image.width / 15, image.height / 1.18);
                    break;
            }

            const stream = canvas.createPNGStream();
            res.writeHead(200, { "Content-Type": "image/png" });
            stream.pipe(res);
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
