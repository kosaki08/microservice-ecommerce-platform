.PHONY: up down exec restart logs install-deps prisma-migrate prisma-generate prisma-studio help

up: ## アプリケーションの起動（開発環境）
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml up

up-debug: ## アプリケーションの起動 (debug profile)
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml --profile debug up

up-monitoring: ## アプリケーションの起動 (monitoring profile)
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml --profile monitoring up

down: ## アプリケーションの停止（開発環境）
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml down --volumes --remove-orphans

exec: ## コンテナ内でコマンドを実行 (例: make exec service=user-service cmd="pnpm install")
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml exec $(service) $(cmd)

restart: ## アプリケーションの再起動
ifeq ($(service),)
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml restart
else
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml restart $(service)
endif

logs: ## ログの表示
ifeq ($(service),)
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml logs -f
else
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml logs -f $(service)
endif

install-deps: ## 依存パッケージのインストール
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml exec $(service) pnpm add $(pkg) --filter @portfolio-2025/$(service)

prisma-migrate: ## Prismaのマイグレーション
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml exec $(service) npx prisma migrate dev

prisma-generate: ## Prismaのモデル生成
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml exec $(service) npx prisma generate

prisma-studio: ## Prisma Studioの起動
	docker compose -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml exec $(service) npx prisma studio

help: ## コマンド一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help