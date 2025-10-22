# ---------------------------------------
# 🐳 Dockerfile for Next.js API (CRUD)
# ---------------------------------------
FROM node:20-bullseye-slim

WORKDIR /app

# System deps for native modules (sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ bash && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies (omit dev deps)
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source code
COPY . .

# Build the Next.js API (clear cache to ensure fresh bundle)
RUN rm -rf .next && npm run build

# Runtime port configuration for Next.js
ENV PORT=4000
EXPOSE 4000

# Start the Next.js server
CMD ["npm", "start"]
