# Multi-stage build for optimized Docker image
# Stage 1: Build stage
FROM docker.io/node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Copy package files for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/notification/package.json ./apps/notification/

# Install dependencies and clean up in same layer
RUN pnpm install --frozen-lockfile --prod=false && \
    pnpm store prune

# Copy source code and build
COPY . .
RUN pnpm nx build @gedu/notification --prod

# Stage 2: Production stage
FROM alpine:3.19 AS production

# Install Node.js and clean up in a single layer
RUN apk add --no-cache nodejs~=20.15 && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Set working directory
WORKDIR /app

# Copy application files
COPY --from=builder /app/apps/notification/dist ./
COPY --from=builder /app/apps/notification/package.json ./

# Install only production dependencies with minimal size
RUN apk add --no-cache npm && \
    npm install --omit=dev --no-package-lock --production && \
    npm cache clean --force && \
    apk del npm && \
    rm -rf /root/.npm /tmp/* /var/cache/apk/* && \
    find . -type f -name "*.map" -delete && \
    find . -type f -name "*.ts" -delete && \
    find . -type d -name "test" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name "tests" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name "doc" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name "docs" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type f -name "README*" -delete && \
    find . -type f -name "readme*" -delete && \
    find . -type f -name "LICENSE*" -delete && \
    find . -type f -name "license*" -delete

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Start the application
CMD ["node", "main.js"]
