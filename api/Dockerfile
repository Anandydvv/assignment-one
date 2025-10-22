# API Dockerfile (Next.js, Node 20 Alpine)
# - Installs dependencies
# - Builds the production app (generates .next)
# - Starts with `npm start` on port 4000
FROM node:20-alpine

WORKDIR /app

# Install dependencies using package lock for reproducibility
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the Next.js app for production so `.next` exists at runtime
RUN npm run build

# Next.js will listen on PORT (default 3000). We use 4000 here.
ENV PORT=4000
EXPOSE 4000

# Run the production server
CMD ["npm", "start"]
