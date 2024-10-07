# Use an official Node.js LTS image as the base image
FROM node AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ./be-financial-helper ./be-financial-helper
COPY ./fe-financial-helper ./fe-financial-helper

WORKDIR /app/fe-financial-helper
RUN npm install
RUN npm run build

WORKDIR /app/be-financial-helper

RUN npm install
RUN npm run build

WORKDIR /app/be-financial-helper

EXPOSE 3001

# Define the command to run your application
CMD ["npm", "run", "start:prod"]
