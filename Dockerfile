# Docker file for the Fragments microservice
# Used by the Docker engine to create the image

# Specifies the base image
FROM node:19.0.0

LABEL maintainer="Carmen Whitton <carmenwhitton@gmail.com>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Define the working directory, so it's created and cd'd into
WORKDIR /app

# Copy the package for config into the root dir
COPY package*.json ./

# Install deps
RUN npm install

# Copy source
COPY ./src ./src

# Copy test auth
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the service
CMD npm start

# Expose port 8080
EXPOSE 8080
