# First stage: Build the app using Node.js
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app for production
RUN npm run build

# Second stage: Serve the app using a lightweight production image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/next.config.js /app/next.config.js
COPY package.json package-lock.json /app/

# Install only production dependencies
RUN npm install --production

# Set the environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
