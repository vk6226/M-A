# ====================================================
# Multi-Stage Production Dockerfile for AURA M&A Platform
# Stage 1: Build the React TypeScript application with Node.js
# Stage 2: Serve compiled static files with Nginx Alpine
# ====================================================

# Step 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source
COPY . .

# Build production assets (TypeScript check + Vite bundle)
RUN npm run build

# Step 2: Production Web Server Stage
FROM nginx:1.27-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled production bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration optimized for React SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
