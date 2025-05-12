module.exports = {
  apps: [
    {
      name: "aegisum-sync",
      script: "scripts/sync-blockchain.js",
      watch: false,
      env: {
        NODE_ENV: "production",
        MONGODB_URI: "mongodb://localhost:27017/explorerdb",
        MONGODB_DB: "explorerdb",
        RPC_HOST: "127.0.0.1",
        RPC_PORT: "39940",
        RPC_USER: "clyntor1",
        RPC_PASS: "clyntor1",
        SYNC_INTERVAL: "60000"
      },
      max_memory_restart: "1G",
      restart_delay: 10000
    }
  ]
};
