import CommandModel from "~/types/jeanne/Command";
import { Schema } from "mongoose";

const Command: Schema<CommandModel> = new Schema<CommandModel>({
    name: String,
    category: String,
    description: String,
    usage: String,
    aliases: [String],
    subCommands: [String],
    cooldown: Number,
    allowPrivate: Boolean,
    userPermissions: [String],
    botPermissions: [String],
    donatorsOnly: Boolean,
    hidden: Boolean
});

export default Command;
