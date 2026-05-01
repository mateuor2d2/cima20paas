# Multi-stage Dockerfile for Nuxt 3 SSR app
# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++ gcc libc-dev

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Install additional runtime dependencies for @nuxt/image
RUN bun add ofetch

# Copy all source files
COPY . .

# Build the Nuxt app
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Copy built output from builder
COPY --from=builder /app/.output ./.output

# Copy content directory for Nuxt Content v3 runtime queries
COPY --from=builder /app/content ./content

# Copy node_modules for runtime dependencies (@nuxt/image needs ofetch)
COPY --from=builder /app/node_modules ./node_modules

# Remove existing node_modules in .output/server and create symlink to root
RUN rm -rf /app/.output/server/node_modules && ln -sf /app/node_modules /app/.output/server/node_modules

# Copy package.json for reference
COPY --from=builder /app/package.json ./

# Expose the port Nuxt runs on
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the server
CMD ["bun", ".output/server/index.mjs"]
