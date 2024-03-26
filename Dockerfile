# Use a smaller base image for the build stage
FROM node:alpine as build

# Set the working directory
WORKDIR /app

# Copy your application files
COPY . /app

# Build your Next.js application
RUN npm ci && npm run build && npm prune --production

# Use an even smaller base image for the final production image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Set the environment variables using build arguments
ARG url 
ENV MONGO_URL=$url
ARG token 
ENV TOKEN_SECRET=$token
ARG domain 
ENV DOMAIN=$domain

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy built files from the build stage
COPY --from=build /app/next.config.js ./
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port your app runs on
EXPOSE 3000

# Define environment variables
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

# Start your application
CMD ["node", "server.js"]