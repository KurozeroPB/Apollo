import express from "express";
import path from "path";
import axios from "axios";
import settings from "@/settings";
import Base from "~/router/Base";
import Router from "~/router/Router";
import Query from "~/graphql/Repos.graphql";
import { Response } from "~/types/Response";
import { statusCodes } from "~/utils/utils";

export default class extends Base {
    constructor(controller: Router) {
        const subpath = path.dirname(__filename).split(path.sep).pop();
        super({ path: `/${subpath}/pinned`, method: "GET", controller });
        this.controller.router.get(this.path, this.run.bind(this));
    }

    async run(req: express.Request, res: express.Response): Promise<void> {
        // Return if no origin is send or origin is not vdbroek.dev
        const origin = (req.headers.origin as string) || req.headers.referer || "";
        if (!origin || !origin.match(/^(https:\/\/)?vdbroek\.dev(\/)?$/iu)) {
            res.status(405).json(Response(statusCodes[405].json));
            return;
        }

        try {
            // prettier-ignore
            const response = await axios.post("https://api.github.com/graphql", {
                query: Query
            }, {
                auth: {
                    username: settings.github.username,
                    password: settings.github.password
                }
            });

            let repos: any[] = response.data.data.repositoryOwner.itemShowcase.items.edges;
            if (repos) {
                repos = repos.map((repo) => repo.node);
                repos.forEach((repo) => {
                    if (Object.keys(repo).length > 0) {
                        if (repo.name.includes("-")) repo.name = repo.name.replace("-", " ");
                        if (repo.fundingLinks.length > 0) repo.fundingLinks = (repo.fundingLinks as any[]).filter((link) => link.platform !== "GITHUB");

                        let topics = [];
                        if (repo.topics.nodes.length > 0) {
                            topics = (repo.topics.nodes as any[]).map((node) => node.topic); // Save topics in variable
                            repo.topics = []; // Empty topics node array
                            repo.topics = topics; // Add topics directly to topics array
                        } else {
                            repo.topics = [];
                        }
                    } else {
                        const index = repos.indexOf(repo);
                        repos.splice(index, 1);
                    }
                });
            }

            res.status(200).json(
                Response({
                    ...statusCodes[200].json,
                    repos
                })
            );
        } catch (error) {
            this.handleException(res, error);
        }
    }
}
