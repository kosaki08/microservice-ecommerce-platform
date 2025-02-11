FROM node:18-alpine

WORKDIR /app

# pnpmのインストール
RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# ワークスペース設定ファイルをコピー
COPY pnpm-*.* ./
COPY package.json turbo.json ./

# 全パッケージのpackage.jsonをコピー
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/prettier-config/package.json ./packages/prettier-config/
COPY apps/rest-frontend/package.json ./apps/rest-frontend/

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY packages ./packages
COPY apps/rest-frontend ./apps/rest-frontend

# パスを設定
ENV PATH /app/node_modules/.bin:$PATH

CMD ["pnpm", "run", "--filter", "rest-frontend", "dev"]
