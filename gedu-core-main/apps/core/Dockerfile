# Build Stage
FROM node:20.9-alpine3.18 AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy package files for better caching
COPY package.json pnpm-lock.yaml ./

# Copy source code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

ENV NX_DAEMON=false

# Build the application
RUN pnpm nx build core --configuration=production

# Production dependencies stage
FROM node:20.9-alpine3.18 AS deps

RUN npm install -g pnpm@10.14.0

WORKDIR /app

COPY --from=builder /app/dist/apps/core ./

RUN pnpm install --prod --frozen-lockfile --no-optional

# Runtime Stage
FROM node:20.9-alpine3.18

WORKDIR /app

# Install runtime dependencies and Prisma CLI
RUN apk add --no-cache openssl bash curl

# Copy built application and necessary files
COPY --from=deps /app ./
COPY --from=builder /app/dist/assets ./assets
COPY --from=builder /app/libs/prisma/prisma ./libs/prisma/prisma
COPY --from=builder /app/libs/prisma/generated ./libs/prisma/generated

# Copy migration entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV RUN_MODE=build
ENV ENABLE_SWAGGER=false
ENV NODE_ENV=production

EXPOSE 3000

# Use entrypoint script for migrations + app startup
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "main.js"] 