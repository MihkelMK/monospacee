# Use this image as the platform to build the app
FROM node:18 AS external-website

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Copy all local files into the image
COPY . .

RUN rm -rf node_modules pnpm-lock.yaml .svelte-kit

# Clean install all node modules
RUN yarn global add pnpm && pnpm i

# Build SvelteKit app
CMD ["npm","run","dev"]
