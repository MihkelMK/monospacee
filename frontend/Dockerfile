# Use this image as the platform to build the app
FROM node:18 AS external-website

# The WORKDIR instruction sets the working directory for everything that will happen next
WORKDIR /app

# Install packages
RUN yarn global add pnpm
COPY package.json .
RUN pnpm i

# Create DB
COPY ./prisma/schema.prisma ./prisma/schema.prisma
COPY tsconfig.json ./
RUN npx prisma generate

COPY . .

# Build SvelteKit app
RUN pnpm build && \
    rm -rf src/ static/

# This is the command that will be run inside the image when you tell Docker to start the container
CMD ["node","build/index.js"]
