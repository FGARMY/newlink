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
COPY apps/web/ ./apps/web/

# Build-time environment variables
ARG API_BASE_URL=http://localhost:4000/api/v1
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV API_BASE_URL=${API_BASE_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies deterministically
RUN npm ci

# Compile UI packages and build Next.js with standalone output
RUN npx turbo run build --filter=web...

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Run as dedicated non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public static files
COPY --chown=nextjs:nodejs --from=builder /app/apps/web/public ./apps/web/public

# Copy standalone output and static bundle
COPY --chown=nextjs:nodejs --from=builder /app/apps/web/.next/standalone ./
COPY --chown=nextjs:nodejs --from=builder /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "apps/web/server.js"]
