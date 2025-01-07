# Stage 1: Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy all files and build the project
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine
WORKDIR /app

# Copy only production dependencies
COPY package.json ./
RUN npm install --production

# Copy build output and necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://64.227.5.64:8000
ENV NEXTAUTH_URL=http://localhost:8000
ENV NEXTAUTH_SECRET = 12345


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
