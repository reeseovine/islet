FROM node:lts-alpine

# Create volumes before copying files
VOLUME /app/posts
VOLUME /app/static
VOLUME /app/config

# Copy source code
WORKDIR /app
ADD . .

# Install dependencies
RUN npm --verbose ci --omit=dev

# Start your blog!
CMD npm start
EXPOSE 5000
