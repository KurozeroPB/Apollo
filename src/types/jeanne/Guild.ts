import { Document } from "mongoose";

interface IGuild {
    gid: string;
    prefix: string;
    blacklisted: boolean;
    subbedEvents: string[];
    logChannel: string;
    ignoredCommands: string[];
    welcomeMessage: string;
    welcomeEnabled: boolean;
    welcomeChannel: string;
    levelupMessage: string;
    levelupEnabled: boolean;
}

interface IGuildModel extends IGuild, Document {};

export default IGuildModel;
