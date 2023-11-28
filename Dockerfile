# Docker file for the Fragments microservice
# Used by the Docker engine to create the image

## Multiple build stages do nothing but slow down the build process, as there is no build step for a js Express app.

### Production Stage
FROM node:21.1.0-alpine3.17@sha256:c8e4f0ad53631bbf60449e394a33c5b8b091343a8702bd03615c7c13ae4c445d

LABEL maintainer="Carmen Whitton <carmenwhitton@gmail.com>"
LABEL description="Fragments node.js microservice"

WORKDIR /app

# Copy the package for config into the root dir
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy source
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./tests ./tests

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

ENV NODE_ENV=production

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Start the service
USER node

CMD ["node", "./src/index.js"]

EXPOSE 8080
