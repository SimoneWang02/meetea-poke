#!/usr/bin/env bash
set -euo pipefail

cd /var/www

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY environment variable is not set." >&2
    exit 1
fi

echo "Waiting for database..."
until php -r "new PDO('mysql:host='.getenv('DB_HOST').';port='.getenv('DB_PORT').';dbname='.getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'));" 2>/dev/null; do
    sleep 2
done
echo "Database ready."

php artisan migrate --force --no-interaction

php artisan storage:link || true

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

exec "$@"
