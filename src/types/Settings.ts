interface MongoDB {
    user: string;
    password: string;
    host: string;
    port: number;
    name: string;
}

interface Sentry {
    dsn: string;
}

interface Patreon {
    secret: string;
    webhook: {
        token: string;
        id: string;
    };
}

interface Api {
    version: string;
}

interface GitHub {
    username: string;
    password: string;
}

interface Discord {
    id: string;
    secret: string;
    jeanne: string;
}

interface Twitch {
    id: string;
    secret: string;
}

interface Settings {
    env: string;
    port: number;
    uaBlacklist: string[];
    database: MongoDB;
    sentry: Sentry;
    patreon: Patreon;
    api: Api;
    github: GitHub;
    discord: Discord;
    twitch: Twitch;
}

export default Settings;
