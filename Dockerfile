FROM node:lts-alpine

# Create volumes before copying files
WORKDIR /app
VOLUME /app/posts
VOLUME /app/static
VOLUME /app/config

# Copy source code
ADD . /app

# Install dependencies
RUN yarn install

# Start your blog!
CMD yarn start
