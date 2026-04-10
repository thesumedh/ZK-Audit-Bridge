# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on the lock file
COPY package*.json ./
RUN npm ci

# Copy source code and build the React app
COPY . .
RUN npm run build

# Production Stage (Nginx)
FROM nginx:alpine

# Copy built assets from builder phase
COPY --from=builder /app/dist /usr/share/nginx/html

# Provide standard default Nginx configuration for single-page applications
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
