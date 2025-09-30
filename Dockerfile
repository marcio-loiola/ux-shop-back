# Build stage
FROM node:20-alpine AS builder

RUN apk add --no-cache bash

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs

WORKDIR /home/nestjs/app

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/.docker ./.docker

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3333

CMD ["npm", "run", "start:prod"]

# Development stage
FROM node:20-alpine AS development

RUN apk add --no-cache bash

RUN npm install -g @nestjs/cli

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs

WORKDIR /home/nestjs/app

# Copy package files
COPY --chown=nestjs:nodejs package*.json ./

# Install all dependencies
RUN npm ci

EXPOSE 3333

CMD ["npm", "run", "start:dev"]