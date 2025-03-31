#!/bin/sh

# 依存関係の変更を検知
if [ -f "/app/package.json" ]; then
  PNPM_STORE=$(pnpm store path)
  if find /app -name 'package.json' | grep -q .; then
    echo "依存関係をインストールしています..."
    pnpm install --frozen-lockfile
    pnpm rebuild
  fi
fi

# Prisma Generate の実行（サービス名を特定）
SERVICE_NAME=""

# Dockerfile から ENTRYPOINT の引数を使ってサービス名を特定する
if [ "$2" = "--filter" ] && [ -n "$3" ]; then
  SERVICE_NAME="$3" # 例: "user-service"
elif [ "$3" = "--filter" ] && [ -n "$4" ]; then
  SERVICE_NAME="$4" # 例: "user-service"
fi

# サービス名が取得できた場合に Prisma Generate を実行
if [ -n "$SERVICE_NAME" ] && [ "$SERVICE_NAME" != "vault-service" ]; then
  # 該当サービスのPrismaスキーマが存在するかチェック
  PRISMA_SCHEMA_PATH="/app/packages/prisma-schemas/src/${SERVICE_NAME}/schema.prisma"
  if [ -f "$PRISMA_SCHEMA_PATH" ]; then
    echo "Prisma スキーマを生成しています ($SERVICE_NAME)..."
    # 実行コマンド修正: --schema オプションを追加
    cd /app && pnpm --filter $SERVICE_NAME prisma generate --schema ./packages/prisma-schemas/src/$SERVICE_NAME/schema.prisma
  else
    echo "Prisma スキーマが見つかりません: $PRISMA_SCHEMA_PATH"
  fi
fi

# 渡されたコマンドを実行
exec "$@"
