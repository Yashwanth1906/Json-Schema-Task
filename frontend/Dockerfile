# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from build stage
COPY --from=build /app/dist ./dist

# Install serve globally
RUN npm install -g serve

# Expose port 5174
EXPOSE 5174

# Start the application using serve package
CMD ["serve", "-s", "dist", "-l", "5174"]
