# Multi-stage Dockerfile for Nuxt 3 SSR app
# Build stage
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build the Nuxt app
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Copy built output from builder
COPY --from=builder /app/.output ./.output

# Copy package.json for potential runtime dependencies
COPY --from=builder /app/package.json ./

# Expose the port Nuxt runs on
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Start the server
CMD ["bun", ".output/server/index.mjs"]
