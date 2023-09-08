# Use this image as the platform to build the app
FROM node:18 AS external-website

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Copy all local files into the image
COPY . .

# Clean install all node modules
RUN rm -rf pnpm-lock.yaml node_modules .svelte-kit && yarn global add pnpm && pnpm i

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["pnpm", "dev"]
