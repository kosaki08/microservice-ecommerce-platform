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
cd /app && pnpm run --filter @portfolio-2025/shared build
set +e

# 渡されたコマンドを実行
exec "$@"
