FROM node:18-alpine AS builder

WORKDIR /app

# pnpmのインストール
RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# ワークスペース設定ファイルをコピー
COPY pnpm-*.* ./
COPY package.json turbo.json ./

# 必要なパッケージのpackage.jsonをコピー
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/*.json ./packages/typescript-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY apps/rest-backend/services/vault-service/package.json ./apps/rest-backend/services/vault-service/

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY packages ./packages
COPY apps/rest-backend/services/vault-service/ ./apps/rest-backend/services/vault-service/

# ビルド
RUN pnpm run --filter vault-service build

# 本番環境用イメージ
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/main.js"]