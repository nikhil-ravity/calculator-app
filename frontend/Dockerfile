# Multi-stage build for React app
FROM node:22.19.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:12.22.9-alpine
WORKDIR /app

# Install serve package globally
RUN npm install -g serve

# Copy build artifacts from build stage
COPY --from=build /app/build ./build

# Expose port 5000 (or any other preferred port)
EXPOSE 5000

# Start the static server with serve
CMD ["serve", "-s", "build", "-l", "5000"]

