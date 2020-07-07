import GuildModel from "~/types/jeanne/Guild";
import { Schema } from "mongoose";

const Guild: Schema<GuildModel> = new Schema<GuildModel>({
    id: String,
    prefix: String,
    blacklisted: Boolean,
    subbedEvents: [String],
    logChannel: String,
    ignoredCommands: [String],
    welcomeMessage: String,
    welcomeEnabled: Boolean,
    welcomeChannel: String,
    levelupMessage: String,
    levelupEnabled: Boolean
});

export default Guild;
