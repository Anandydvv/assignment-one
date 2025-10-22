# ---------------------------------------
# 🐳 Dockerfile for Next.js API (CRUD)
# ---------------------------------------
FROM node:20-alpine

WORKDIR /app

# System deps for native modules (e.g., sqlite3)
RUN apk add --no-cache python3 make g++

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
