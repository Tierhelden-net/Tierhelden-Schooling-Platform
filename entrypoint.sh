#!/bin/sh
set -e

echo "Waiting for Postgres to be available..."

# Loop until Postgres is accepting connections on port 5432.
while ! nc -z postgres 5432; do
  sleep 1
  echo "Still waiting for Postgres..."
done

echo "Postgres is up!"

# Run Prisma migrations
npx prisma migrate dev

# Execute the container's main command
exec "$@"