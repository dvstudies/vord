module.exports = {
    apps: [
        {
            name: "vord",
            script: "npm",
            args: "run start",
            watch: false,
            env: {
                NODE_ENV: "production",
                NODE_PORT: 1342,
            },
        },
    ],
};
