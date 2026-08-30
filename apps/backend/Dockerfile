# Stage 1: Build
FROM node:24-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
RUN npm ci -w apps/backend
COPY apps/backend apps/backend
WORKDIR /repo/apps/backend
RUN npm run build
WORKDIR /repo/apps/backend/build
RUN npm install --omit=dev

# Stage 2: Production
FROM node:24-slim AS production
WORKDIR /app
COPY --from=build /repo/apps/backend/build ./
USER node
EXPOSE 3333
ENV NODE_ENV=production
CMD ["node", "bin/server.js"]