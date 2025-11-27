FROM node:20-alpine AS base

#
# INSTALL STAGE - Production dependencies only
#
FROM base AS prod-deps

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Fetch deps with caching
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm fetch --frozen-lockfile

# Install prod deps with caching
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod

#
# BUILD STAGE
#
FROM base AS build

# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#using-pipes
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Fetch deps with caching
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm fetch --frozen-lockfile

# Install all deps (including devDependencies) with caching
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# Copy config files (change less frequently - better layer caching)
COPY svelte.config.js tsconfig.json vite.config.ts ./
COPY project.inlang ./project.inlang

# Copy source code (changes more frequently)
COPY src ./src
COPY static ./static
COPY messages ./messages

# Set latest post in environment
RUN printf 'PUBLIC_LATEST_POST=%s\n' "$(basename "$(find src/posts -name "*.md" | sort -n | tail -n 1)" ".md")" > .env

# Build SvelteKit app
RUN pnpm build

#
# PRODUCTION STAGE
#
FROM base

RUN corepack enable && \
  apk add --no-cache netcat-openbsd && \
  addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

# Set ownership and permissions
RUN chown -R nodejs:nodejs /app

# Switch to non-root user for security
USER nodejs

# Set environment variables for the production container
ENV ORIGIN=http://localhost:3000
ENV NODE_ENV=production
ENV UV_THREADPOOL_SIZE=128
ENV NODE_OPTIONS=--max-old-space-size=1536

# Expose the port the app runs on
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD nc -z localhost 3000 || exit 1

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node", "build/index.js"]
