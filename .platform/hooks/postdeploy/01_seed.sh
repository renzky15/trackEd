#!/bin/bash

# Navigate to the application directory
cd /var/app/current

# Install dependencies if needed
npm install

# Generate Prisma client
npx prisma generate

# Run the seed script
echo "Running database seed..."
node prisma/seed.js

echo "Post-deploy hook completed" 