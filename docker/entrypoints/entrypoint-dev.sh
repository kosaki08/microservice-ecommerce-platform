#!/bin/sh

# 依存関係の変更を検知
INSTALLED_FLAG="/app/node_modules/.installed_flag" # 識別用ファイル
if [ ! -f "$INSTALLED_FLAG" ] || [ "/app/package.json" -nt "$INSTALLED_FLAG" ] || [ "/app/pnpm-lock.yaml" -nt "$INSTALLED_FLAG" ]; then
  echo "依存関係をインストール/更新しています..."
  pnpm install --frozen-lockfile && pnpm rebuild && touch "$INSTALLED_FLAG"
  echo "依存関係のインストール完了。"
else
  echo "依存関係は最新です。"
fi

# prisma-schemas をビルド (dist を生成)
echo "Building prisma-schemas..."
# エラーが発生しても続行しないように exit on error を設定
set -e
cd /app && pnpm run --filter @portfolio-2025/prisma-schemas build
# エラーハンドリングを解除
set +e

# shared をビルド (dist を生成)
echo "Building shared package..."
set -e
cd /app/packages/shared && pnpm run build
set +e

# Prisma Generate の実行（サービス名を特定）
SERVICE_NAME=$(echo $@ | grep -oE '\-\-filter[= ]+([^ ]+)' | sed -E 's/--filter[= ]+//')

# サービス名が取得できた場合に Prisma Generate を実行
if [ -n "$SERVICE_NAME" ] && [ "$SERVICE_NAME" != "vault-service" ]; then
  # 該当サービスのPrismaスキーマが存在するかチェック
  PRISMA_SCHEMA_PATH="/app/packages/prisma-schemas/src/${SERVICE_NAME}/schema.prisma"
  PRISMA_CLIENT_OUTPUT_PATH="/app/packages/prisma-schemas/src/${SERVICE_NAME}/generated/client"

  if [ -f "$PRISMA_SCHEMA_PATH" ]; then
    echo "Cleaning previous Prisma Client generation (if any) for $SERVICE_NAME..."
    rm -rf "$PRISMA_CLIENT_OUTPUT_PATH"
    mkdir -p "$(dirname "$PRISMA_CLIENT_OUTPUT_PATH")"

    echo "Generating Prisma client for $SERVICE_NAME in the current environment..."
    set -e
    pnpm --filter "$SERVICE_NAME" exec -- prisma generate --schema "$PRISMA_SCHEMA_PATH"
    set +e
    echo "Prisma client generated for $SERVICE_NAME."
  else
    echo "Prisma スキーマが見つかりません: $PRISMA_SCHEMA_PATH"
  fi
fi

# 渡されたコマンドを実行
exec "$@"
