interface MongoSettings {
    user: string;
    password: string;
    host: string;
    port: number;
    name: string;
}

interface SentrySettings {
    dsn: string;
}

interface PatreonSettings {
    secret: string;
    webhook: {
        token: string;
        id: string;
    };
}

interface ApiSettings {
    githubKey: string;
    version: string;
}

interface DiscordSettings {
    clientId: string;
    clientSecret: string;
    jeanne: string;
}

interface Settings {
    env: string;
    port: number;
    uaBlacklist: string[];
    database: MongoSettings;
    sentry: SentrySettings;
    patreon: PatreonSettings;
    api: ApiSettings;
    discord: DiscordSettings;
}

export default Settings;
