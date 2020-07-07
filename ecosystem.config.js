module.exports = {
    apps: [
        {
            name: "ScopeAPI",
            script: "ts-node",
            args: "-r tsconfig-paths/register ./src/server.ts",
            instances: 1,
            autorestart: true,
            watch: false,
            exec_mode: "fork",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
};