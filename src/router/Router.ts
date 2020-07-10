import path from "path";
import express from "express";
import chalk from "chalk";
import Collection from "@kurozero/collection";
import Base from "./Base";
import Logger from "~/utils/Logger";
import Database from "~/utils/Database";
import { rfile } from "~/utils/utils";
import { promises as fs } from "fs";

class Router {
    router: express.Router;
    routes: Collection<Base>;
    path: string;
    logger: Logger;
    database: Database;

    constructor(logger: Logger) {
        this.router = express.Router();
        this.routes = new Collection(Base);
        this.path = "/api";
        this.logger = logger;
        this.database = new Database({
            useCreateIndex: true,
            useNewUrlParser: true,
            keepAlive: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    }

    async* getFiles(dir: string): AsyncGenerator<string, void, unknown> {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        for (const dirent of dirents) {
            const res = path.resolve(dir, dirent.name);
            if (dirent.isDirectory()) {
                yield* this.getFiles(res);
            } else {
                if (rfile.test(res)) {
                    yield res;
                }
            }
        }
    }

    async init(): Promise<void> {
        const basePath = path.join(__dirname, "routes");
        for await (const file of this.getFiles(basePath)) {
            console.log(file);
            const Route = (await import(file)).default;
            const route = new Route(this) as Base;
            this.logger.info("LOAD", `(Connected Route): ${chalk.redBright(`[${route.method}]`)} ${chalk.yellow(`${this.path}${route.path}`)}`);
            this.routes.add(route);
        }
    }
}

export default Router;
