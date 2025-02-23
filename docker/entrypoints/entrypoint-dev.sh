#!/bin/sh

# 依存関係のインストールを実行
pnpm install

# 渡されたコマンドを実行
exec "$@"