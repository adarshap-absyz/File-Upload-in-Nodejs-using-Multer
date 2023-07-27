# First stage: build the application
FROM node:18-alpine3.15 as build

# Install dumb-init
# RUN apk add --no-cache dumb-init

# Create a new group and user for the Node.js process
RUN addgroup nodegroup
# RUN usermod -aG nodegroup nodeuser
# RUN adduser nodeuser nodegroup
RUN adduser -S nodeuser -G nodegroup

# Verify that the user is in the group
RUN id nodeuser

RUN  chown -R nodeuser:nodegroup /home/nodeuser
# Set the working directory and ownership to the new user and group
WORKDIR /usr/src/app
RUN chown -R nodeuser:nodegroup /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json .

# Install the dependencies
RUN npm install

# Transfer privileges to the new user
USER nodeuser

# Copy the source code
COPY . .

# Build the application
RUN npm start
# RUN mkdir -p /usr/src/app/dist/uploads
# Second stage: create the production image
FROM node:18-alpine3.15 as production

# COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
# Set the environment as production
ENV NODE_ENV production

# Set the working directory
WORKDIR /usr/src/app
# Copy the package.json and package-lock.json files
COPY --from=build /usr/src/app/package*.json /usr/src/app/.env.production ./
COPY --chown=nodeuser:nodegroup --from=build /usr/src/app/dist ./dist

# Install only production dependencies
RUN npm ci --only=production

# Start the application
# CMD [ "dumb-init","node", "./dist/server.js" ]
CMD ["node", "./dist/server.js" ]
