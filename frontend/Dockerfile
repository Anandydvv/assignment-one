# --- Frontend Dockerfile ---
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Important: standalone build for Docker
RUN npm run build

# The Next.js standalone server listens on PORT
ENV PORT=3000
EXPOSE 3000

# Start using standalone server.js (next start isn't compatible with output:standalone)
CMD ["node", ".next/standalone/server.js"]
