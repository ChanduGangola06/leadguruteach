module.exports = {
  apps: [
    {
      name: "leadguruteach",
      cwd: "/var/www/leadguruteach",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Loads variables from .env in cwd automatically if you use dotenv,
      // but Next.js reads .env / .env.production at build AND start from project root.
      max_memory_restart: "512M",
      error_file: "/var/log/pm2/leadguruteach-error.log",
      out_file: "/var/log/pm2/leadguruteach-out.log",
      time: true,
    },
  ],
};
