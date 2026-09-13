# -------------------------------------------------------------
# Stage 1: Build static assets with Node.js
# -------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build project
COPY . .
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Serve optimized static bundle with Nginx
# -------------------------------------------------------------
FROM nginx:alpine AS runner

# Clean default web root
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy tailored Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose container port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
