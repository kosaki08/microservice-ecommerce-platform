# Stage 1: Builder
FROM node:20-alpine3.20 AS builder

WORKDIR /app

# pnpmのインストール
RUN npm install -g corepack@latest && \
  corepack enable && \
  corepack prepare pnpm@10.6.4 --activate

# 依存関係ファイルのコピー
COPY pnpm-*.* ./
COPY package.json turbo.json ./
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/*.json ./packages/typescript-config/
COPY apps/rest-backend/services/user-service/package.json ./apps/rest-backend/services/user-service/

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY packages ./packages
COPY apps/rest-backend/services/user-service/ ./apps/rest-backend/services/user-service/

# ビルドを実行
RUN pnpm run --filter user-service build

# Stage 2: Runner
FROM node:20-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]