# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

# ==========================================
# Stage 1: Base Alpine Environment
# ==========================================
FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat curl

# ==========================================
# Stage 2: Monorepo Builder
# ==========================================
FROM base AS builder
WORKDIR /app

# Copy package manifests and workspace configuration
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies deterministically
RUN npm ci

# Compile packages and build NestJS API
RUN npx turbo run build --filter=@newlink/api...

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=4000

# Security: Run as dedicated non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy root manifest and workspace structures
COPY --chown=nestjs:nodejs package.json package-lock.json ./
COPY --chown=nestjs:nodejs packages/ ./packages/
COPY --chown=nestjs:nodejs apps/api/package.json ./apps/api/package.json

# Copy installed node_modules and built application artifacts
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/packages/domain/dist ./packages/domain/dist
COPY --chown=nestjs:nodejs --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --chown=nestjs:nodejs --from=builder /app/apps/api/dist ./apps/api/dist

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/vehicles || exit 1

CMD ["node", "apps/api/dist/main.js"]
