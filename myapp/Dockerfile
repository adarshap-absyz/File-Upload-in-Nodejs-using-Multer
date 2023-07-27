# First stage: build the application
FROM node:18-alpine3.15 as build

# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Expose the port on which the Express.js application listens (change it to match your app)
EXPOSE 5000

# Start the Express.js application
CMD ["npm", "start"]
