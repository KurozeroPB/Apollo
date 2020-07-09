import path from "path";
import express from "express";
import mongoose from "mongoose";
import chalk from "chalk";
import Collection from "@kurozero/collection";
import Base from "./Base";
import settings from "@/settings";
import Logger from "~/utils/logger";
import { promises as fs } from "fs";
import { StringBuilder } from "~/utils/StringBuilder";
import { rfile } from "~/utils/utils";

class Router {
    router: express.Router;
    routes: Collection<Base>;
    path: string;
    logger: Logger;

    constructor(logger: Logger) {
        this.router = express.Router();
        this.routes = new Collection(Base);
        this.path = "/api";
        this.logger = logger;
    }

    async init(): Promise<void> {
        const uri = StringBuilder.Format(
            "mongodb://{0}:{1}@{2}:{3}/{4}?retryWrites=true",
            settings.database.user,
            settings.database.password,
            settings.database.host,
            settings.database.port,
            settings.database.name
        );

        await mongoose.connect(uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            keepAlive: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        await this._loadRoutes();
    }

    private async _loadRoutes(): Promise<void> {
        const files = await fs.readdir(path.join(__dirname, "routes"));
        for (const file of files) {
            if (rfile.test(file)) {
                const temp = await import(path.join(__dirname, "routes", file));
                const route: Base = new temp.default(this);

                this.logger.info("LOAD", `(Connected Route): ${chalk.redBright(`[${route.method}]`)} ${chalk.yellow(`${this.path}${route.path}`)}`);
                this.routes.add(route);
            } else {
                const check = await fs.lstat(path.join(__dirname, "routes", file));
                if (check.isDirectory()) {
                    const recursive = await fs.readdir(path.join(__dirname, "routes", file));
                    for (const rf of recursive) {
                        if (rfile.test(rf)) {
                            const dynamic = await import(path.join(__dirname, "routes", file, rf));
                            const route = new dynamic.default(this) as Base;
                            route.path = "/" + file + route.path;

                            this.logger.info("LOAD", `(Connected Route): ${chalk.redBright(`[${route.method}]`)} ${chalk.yellow(`${this.path}${route.path}`)}`);
                            this.routes.add(route);
                        }
                    }
                }
            }
        }
    }
}

export default Router;
