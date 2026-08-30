# Stage 1: Build
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN node run build

# Stage 2: Production
FROM node:24-alpine AS production
WORKDIR /app
COPY --from=build /app/build ./
RUN npm ci --omit=dev
USER appuser
EXPOSE 3333
ENV NODE_ENV=production
CMD ["node", "bin/server.js"]   