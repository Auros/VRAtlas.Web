FROM node:16-alpine as builder

# install dependencies
WORKDIR /app
COPY package.json yarn.lock svelte.config.js vite.config.ts tsconfig.json ./
RUN yarn --frozen-lockfile

# Copy all local files into the image.
COPY . .

ARG PUBLIC_OAUTH_URL
ENV PUBLIC_OAUTH_URL ${PUBLIC_OAUTH_URL}

ARG PUBLIC_API_URL
ENV PUBLIC_API_URL ${PUBLIC_API_URL}

ARG PUBLIC_CDN_URL
ENV PUBLIC_CDN_URL ${PUBLIC_CDN_URL}

ARG PUBLIC_SERVING_URL
ENV PUBLIC_SERVING_URL ${PUBLIC_SERVING_URL}

ARG MODE
ENV MODE ${MODE}

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