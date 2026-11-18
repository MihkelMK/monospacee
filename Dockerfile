FROM node:24.15.0-alpine3.23@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS base

#
# INSTALL STAGE - Production dependencies only
#
FROM base AS prod-deps

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Fetch deps with caching.
# --prod matters: `pnpm fetch` materialises node_modules/.pnpm straight from the
# lockfile and ignores the manifest, so without it the virtual store keeps every dev
# package and they ride along into the runtime image.
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm fetch --prod --frozen-lockfile

# Install prod deps with caching
RUN --mount=type=cache,id=monospacee-pnpm-store,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile --prod

#
# BUILD STAGE
#
FROM base AS build

# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#using-pipes
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

# git: @websites/eslint-config is a git dependency, and pnpm clones it for a host it does not know
RUN corepack enable && \
  apk add --no-cache git

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

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

# Changes every CI run so the cached `apk upgrade` layer below is rebuilt, not reused stale.
ARG APK_CACHE_BUST

# apk upgrade because the base image is digest-pinned: without it the image keeps
# whatever package versions were current when that digest was built.
# npm, corepack and yarn are removed because the runtime only runs `node`, and their bundled dependencies
# (tar, sigstore, ip-address, ...) are a standing source of CVEs in the scan.
RUN echo "apk cache bust: ${APK_CACHE_BUST}" && \
  apk upgrade --no-cache && \
  apk add --no-cache netcat-openbsd && \
  rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /opt/yarn-v* /usr/local/bin/yarn /usr/local/bin/yarnpkg && \
  addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 && \
  mkdir /app && chown nodejs:nodejs /app

WORKDIR /app

# --chown on the COPY instead of a later `chown -R`: that would copy every file again
# into a new layer and double the size of the image (935 MB here).
COPY --from=prod-deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/build ./build
COPY --from=build --chown=nodejs:nodejs /app/package.json ./package.json

# Switch to non-root user for security
USER nodejs

# Set environment variables for the production container
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
