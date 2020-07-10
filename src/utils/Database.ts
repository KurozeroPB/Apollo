import settings from "@/settings";
import { Model, ConnectionOptions, createConnection } from "mongoose";
import { StringBuilder } from "./StringBuilder";

import Command from "~/schemas/jeanne/Command";
import CommandModel from "~/types/jeanne/Command";
import Feature from "~/schemas/jeanne/Feature";
import FeatureModel from "~/types/jeanne/Feature";
import Guild from "~/schemas/jeanne/Guild";
import GuildModel from "~/types/jeanne/Guild";
import Setting from "~/schemas/jeanne/Setting";
import SettingModel from "~/types/jeanne/Setting";
import User from "~/schemas/jeanne/User";
import UserModel from "~/types/jeanne/User";

interface Jeanne {
    Commands: Model<CommandModel>;
    Features: Model<FeatureModel>;
    Guilds: Model<GuildModel>;
    Settings: Model<SettingModel>;
    Users: Model<UserModel>;
}

class Database {
    Jeanne: Jeanne;

    constructor(options: ConnectionOptions) {
        const uri = StringBuilder.Format(
            "mongodb://{0}:{1}@{2}:{3}/{4}?retryWrites=true",
            settings.database.user,
            settings.database.password,
            settings.database.host,
            settings.database.port,
            settings.database.name
        );
        const connection = createConnection(uri, options);

        const jeanne = connection.useDb("jeanne");
        this.Jeanne = {
            Commands: jeanne.model("Commands", Command),
            Features: jeanne.model("Features", Feature),
            Guilds: jeanne.model("Guilds", Guild),
            Settings: jeanne.model("Settings", Setting),
            Users: jeanne.model("Users", User)
        };
    }
}

export default Database;
