# Build stage
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Files will be in /app/dist ready to be mounted 