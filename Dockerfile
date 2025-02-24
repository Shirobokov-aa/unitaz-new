# FROM oven/bun:alpine AS base

# # Stage 1: Install dependencies
# FROM base AS deps
# WORKDIR /app
# COPY package.json bun.lockb ./
# RUN bun install --frozen-lockfile

# # Stage 2: Build the application
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN bun run build

# # Stage 3: Production server
# FROM base AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# EXPOSE 3000
# CMD ["bun", "run", "server.js"]


FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache postgresql-client
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache postgresql-client

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Добавляем скрипт для проверки доступности базы данных
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/bin/sh", "/wait-for-it.sh"]
