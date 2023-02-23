FROM node:16-alpine as builder

# install dependencies
WORKDIR /app
COPY package.json yarn.lock svelte.config.js vite.config.js tsconfig.json ./
RUN yarn --frozen-lockfile

# Copy all local files into the image.
COPY . .

RUN yarn build

###
# Only copy over the Node pieces we need
# ~> Saves 35MB
###
FROM node:16-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/build ./build

CMD ["yarn", "start"]