#!/bin/sh
# Generate Prisma Client
npx prisma generate
# Run database migrations
npx prisma migrate deploy
# Run seed script
node prisma/seed.js
# Start the application
exec node server.js 