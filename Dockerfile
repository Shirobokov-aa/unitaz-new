FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
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
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "run", "server.js"]


# FROM oven/bun:alpine AS base

# # Stage 1: Dependencies
# FROM base AS deps
# WORKDIR /app
# # Устанавливаем только самые необходимые пакеты
# RUN apk add --no-cache python3 make g++

# COPY package.json bun.lockb ./
# # Используем --no-optional чтобы пропустить необязательные зависимости
# RUN bun install --frozen-lockfile --no-optional

# # Stage 2: Builder
# FROM base AS builder
# WORKDIR /app
# RUN apk add --no-cache python3 make g++
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN bun run build

# # Stage 3: Runner
# FROM base AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# RUN apk add --no-cache libc6-compat

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# EXPOSE 3000
# CMD ["bun", "run", "server.js"]
