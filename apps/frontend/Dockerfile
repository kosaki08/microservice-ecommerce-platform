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
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/frontend/package.json ./apps/frontend/

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# ビルドを実行
RUN pnpm run --filter frontend build

# Stage 2: Runner
FROM node:18-slim

WORKDIR /app

# ビルド成果物をコピー
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

# 本番環境変数
ENV NODE_ENV production
ENV PORT 3000

# 起動コマンド
CMD ["node", "apps/frontend/server.js"]
