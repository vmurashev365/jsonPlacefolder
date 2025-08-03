# JSONPlaceholder API Testing Framework - Docker

# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install make for Makefile support
RUN apk add --no-cache make

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY cucumber.js ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY features/ ./features/
COPY scripts/ ./scripts/
COPY Makefile ./

# Build the project
RUN npm run build

# Create necessary directories
RUN mkdir -p reports logs

# Set environment variables
ENV NODE_ENV=test
ENV BASE_URL=https://jsonplaceholder.typicode.com
ENV LOG_LEVEL=info
ENV GENERATE_HTML_REPORT=true

# Expose port for potential report server
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node scripts/health-check.js || exit 1

# Default command
CMD ["npm", "test"]

# Labels
LABEL maintainer="API Testing Team"
LABEL description="JSONPlaceholder API Testing Framework"
LABEL version="1.0.0"
