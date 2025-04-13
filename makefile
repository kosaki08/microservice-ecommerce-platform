# 環境変数の定義
COMPOSE_FILES := -f docker/docker-compose.base.yml -f docker/docker-compose.dev.yml
SERVICES := backend frontend postgres redis
COMPOSE_WATCH := --watch

.PHONY: $(SERVICES) up build down exec restart logs install-deps prisma-migrate prisma-generate prisma-studio help

# 基本コマンド
up: ## 全サービス起動（開発環境）
	docker compose $(COMPOSE_FILES) up $(COMPOSE_WATCH)

up-build: ## ビルドして起動
	docker compose $(COMPOSE_FILES) up --build $(COMPOSE_WATCH)

up-debug: ## debug profile付きで起動
	docker compose $(COMPOSE_FILES) --profile debug up --build $(COMPOSE_WATCH)

up-monitoring: ## monitoring profile付きで起動
	docker compose $(COMPOSE_FILES) --profile monitoring up --build $(COMPOSE_WATCH)

build: ## 全サービスのビルド
	docker compose $(COMPOSE_FILES) build --parallel

down: ## 全サービス停止
	@docker compose $(COMPOSE_FILES) down --volumes --remove-orphans --timeout 0

# サービス個別操作
$(SERVICES): ## 個別サービス操作（例: make service=backend cmd="logs -f"）
	@docker compose $(COMPOSE_FILES) $(cmd) $@

# 共通操作
exec: ## コンテナ内でコマンドを実行（例: make service=backend exec="pnpm install"）
	@docker compose $(COMPOSE_FILES) exec $(service) $(cmd)

restart: ## サービスの再起動
	@docker compose $(COMPOSE_FILES) restart $(service)

logs: ## ログの表示
	@docker compose $(COMPOSE_FILES) logs -f --tail=100 $(service)

# 開発支援
install-deps: ## 依存パッケージのインストール (例: make install-deps service=backend pkg=axios)
	@docker compose $(COMPOSE_FILES) exec $(service) pnpm add $(pkg) --filter @portfolio-2025/$(service)

# Prisma関連
prisma-migrate: ## Prisma マイグレーション実行 (例: make prisma-migrate service=backend)
	@docker compose $(COMPOSE_FILES) exec $(service) pnpm --filter @portfolio-2025/prisma-schemas run migrate:$(service) # package.json側のスクリプト名も合わせる必要あり

prisma-generate: ## Prisma クライアント生成 (例: make prisma-generate service=backend)
	@docker compose $(COMPOSE_FILES) exec $(service) pnpm --filter @portfolio-2025/prisma-schemas run generate:$(service)

prisma-studio: ## Prisma Studio 起動 (例: make prisma-studio service=backend)
	@docker compose $(COMPOSE_FILES) exec $(service) pnpm --filter @portfolio-2025/prisma-schemas run studio:$(service) # package.json側のスクリプト名も合わせる必要あり

# ヘルプ
help: ## コマンド一覧表示
	@echo "\n\033[1m使用可能なコマンド:\033[0m"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo "\n\033[1mサービス一覧:\033[0m"
	@for svc in $(SERVICES); do printf "  \033[33m%-15s\033[0m %s\n" $$svc; done

.DEFAULT_GOAL := help
