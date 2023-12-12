FROM node:14-alpine

# Create directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY --chown=node:node ./package*.json ./

# Switch to node user for dependency installation
USER node

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY --chown=node:node ./ ./

EXPOSE 6500

# Start Express server
CMD ["npm", "run", "start"]