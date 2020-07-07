import Router from "~/router/Router";
import Logger from "./logger";

export const rfile = /^.+\.(j|t)s$/ui;

export interface Context {
    path: string;
    method: string;
    controller: Router;
    logger: Logger;
}
