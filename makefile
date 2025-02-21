.PHONY: install-deps start stop logs prisma-migrate prisma-generate prisma-studio help

install-deps: ## 依存パッケージのインストール
	docker compose exec $(service) pnpm add $(pkg) --filter @portfolio-2025/$(service)

start: ## アプリケーションの起動
	docker compose up -d

stop: ## アプリケーションの停止
	docker compose down

logs: ## ログの表示
ifeq ($(service),)
	docker compose logs -f
else
	docker compose logs -f $(service)
endif

prisma-migrate: ## Prismaのマイグレーション
	docker compose exec $(service) npx prisma migrate dev

prisma-generate: ## Prismaのモデル生成
	docker compose exec $(service) npx prisma generate

prisma-studio: ## Prisma Studioの起動
	docker compose exec $(service) npx prisma studio

help: ## コマンド一覧を表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
