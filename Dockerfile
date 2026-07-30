# syntax=docker/dockerfile:1

###############################################################################
# 1) deps — sadece bagimliliklar (katman onbellegi icin ayri)
###############################################################################
FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN corepack enable

# better-sqlite3 prebuild kullanir; yine de derleme gerekirse diye araclar hazir.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

###############################################################################
# 2) builder — Next.js standalone ciktisi
###############################################################################
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build sirasinda DB'ye ihtiyac YOK: tum sayfalar dinamik render edilir.
# NEXT_PUBLIC_* degiskenleri build'e gomulur; tema pinlemek isterseniz
# docker build --build-arg NEXT_PUBLIC_THEME=<slug> kullanin.
ARG NEXT_PUBLIC_THEME=""
ENV NEXT_PUBLIC_THEME=${NEXT_PUBLIC_THEME}
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

###############################################################################
# 3) runner — minimal calisma imaji
###############################################################################
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_PATH=/data/app.db \
    UPLOADS_DIR=/data/uploads

RUN apt-get update && apt-get install -y --no-install-recommends \
      sqlite3 curl ca-certificates tini \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone cikti: sunucu + gerekli node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Migration + seed calistirabilmek icin gerekli dosyalar
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && mkdir -p /data/uploads \
    && chown -R nextjs:nodejs /data

VOLUME ["/data"]
USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
