#!/usr/bin/env bash
# Run on the VPS from /var/www/leadguruteach after git pull
set -euo pipefail

cd /var/www/leadguruteach

echo "==> Installing dependencies"
npm ci

echo "==> Building Next.js (reads .env / .env.production)"
npm run build

echo "==> Restarting PM2 process"
mkdir -p /var/log/pm2
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

echo "==> Done. Check: pm2 status && curl -I http://127.0.0.1:3000"
