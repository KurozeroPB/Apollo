import { Document } from "mongoose";

interface ICommand {
    name: string;
    category: string;
    description: string;
    usage: string | null;
    aliases: string[];
    subCommands: string[];
    cooldown: number;
    allowPrivate: boolean;
    userPermissions: string[];
    botPermissions: string[];
    donatorsOnly: boolean;
    hidden: boolean;
}

interface ICommandModel extends ICommand, Document {}

export default ICommandModel;
