#!/bin/sh

set -e

echo "Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
    echo "Database is unavailable - sleeping"
    sleep 1
done

echo "Database is up - starting application"
exec bun run server.js
