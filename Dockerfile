### Beginning build image ###
FROM node:18.16.1-alpine AS builder

# working app directory
WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

### Intall prod dependencies ###
FROM node:18.16.1-alpine AS dependencies

WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --omit=dev

### Beginning production image ###
FROM node:18.16.1-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/public ./public
COPY --from=dependencies /app/node_modules ./node_modules

USER node

CMD ["node", "./dist/index.js"]
