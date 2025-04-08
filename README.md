# [WIP] Ecommerce Platform

## 実装状況

✅ = 実装 | 🚧 = 開発中 | ⏳ = 未実装

### 共通基盤

- ✅ モノレポ構成 (Turborepo)
- ✅ Docker + Docker Compose
- ✅ 開発環境用 Makefile
- 🚧 Prometheus + Grafana によるモニタリング
- ⏳ CI/CD (GitHub Actions)
- ⏳ Terraform による IaC

### API

- ✅ Vault 連携 (シークレット管理)
- 🚧 APIゲートウェイ (NestJS)
- 🚧 ユーザーサービス (NestJS)
- 🚧 認証機能 (JWT)
- ⏳ 商品サービス (Fastify)
- ⏳ 注文サービス
- ⏳ 決済サービス
- ⏳ WebSocket によるリアルタイム機能

### フロントエンド

- 🚧 Next.js 15 (App Router)
- 🚧 TailwindCSS + Shadcn/ui
- ⏳ React Query
- ⏳ Jest + React Testing Library
- ⏳ Storybook

### データベース

- ✅ Prisma スキーマ定義
- ⏳ マイグレーション
- ⏳ シードデータ

## 主な技術スタック

| サービス名          | 機能               | 主要技術                                       |
| ------------------- | ------------------ | ---------------------------------------------- |
| User Service        | ユーザー認証・管理 | NestJS, Prisma                                 |
| Product Service     | 商品管理機能       | Fastify, Prisma                                |
| Order Service       | 注文管理機能       | NestJS, Prisma                                 |
| Payment Service     | 決済連携機能       | NestJS, Prisma                                 |
| Vault Service       | シークレット管理   | NestJS, node-vault                             |
| Gateway             | APIゲートウェイ    | NestJS, JWT                                    |
| REST Frontend       | フロントエンド     | Next.js v15, React 19, Tailwind CSS, shadcn/ui |
| Prometheus, Grafana | モニタリング       | prom-client                                    |

## ディレクトリ構成

```
.
├── apps/                          # 各アプリケーション
│   ├── rest-frontend/             # Next.js フロントエンド
│   └── rest-backend/
│       ├── services/
│       │   ├── user-service/      # ユーザーサービス (NestJS)
│       │   ├── vault-service/     # Vault連携サービス (NestJS)
│       │   ├── product-service/   # 商品サービス (Fastify)
│       │   ├── order-service/     # 注文サービス (NestJS)
│       │   └── payment-service/   # 決済サービス (NestJS)
│       └── gateway/               # APIゲートウェイ (NestJS)
├── packages/                       # 共有ライブラリ
│   ├── ui/                         # 共有UIコンポーネント (React, Tailwind CSS, shadcn/ui)
│   ├── prisma-schemas/             # Prisma スキーマ定義と生成されたクライアント
│   ├── shared/                     # サービス間で共有される型定義やユーティリティ関数
│   ├── eslint-config/              # 共有ESLint設定
│   ├── typescript-config/          # 共有TypeScript設定
│   └── jest-config/                # 共有Jest設定
├── infra/                          # インフラ関連の設定ファイル (Terraform, Vault, Prometheus, Grafana)
├── docker/                         # Docker関連ファイル (Dockerfile, docker-compose.yml)
└── docs/                           # ドキュメント関連ファイル
    └── database/
        └── schema.md               # データベーススキーマ定義
```

## 主な開発コマンド (Makefile)

プロジェクトルートで `make` コマンドを実行することで、一般的なタスクを実行できます。

| コマンド                                                      | 説明                                                                                                      |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `make help`                                                   | 利用可能なコマンドの一覧と説明を表示します                                                                |
| `make up`                                                     | 開発環境のコンテナを起動します (ファイルの変更を監視)                                                     |
| `make up-build`                                               | コンテナイメージをビルドして起動します                                                                    |
| `make up-debug`                                               | デバッグ用プロファイル (pgAdmin, Redis Commander など) を含めて起動します                                 |
| `make up-monitoring`                                          | モニタリング用プロファイル (Prometheus, Grafana) を含めて起動します                                       |
| `make down`                                                   | 全ての開発環境コンテナを停止し、ボリュームも削除します                                                    |
| `make build`                                                  | Dockerイメージをビルドします                                                                              |
| `make logs service=<service_name>`                            | 指定したサービスのログを表示します (例: `make logs service=user-service`)                                 |
| `make exec service=<service_name> cmd="<command>"`            | 指定したサービスのコンテナ内でコマンドを実行します (例: `make exec service=user-service cmd="ls -l"`)     |
| `make install-deps service=<service_name> pkg=<package_name>` | 指定したサービスに依存パッケージを追加します (例: `make install-deps service=gateway pkg=axios`)          |
| `make prisma-migrate service=<db_service_name>`               | 指定したサービスに関連するDBマイグレーションを実行します (例: `make prisma-migrate service=user-service`) |
| `make prisma-generate service=<db_service_name>`              | 指定したサービスに関連するPrisma Clientを生成します (例: `make prisma-generate service=user-service`)     |
| `make prisma-studio service=<db_service_name>`                | 指定したサービスに関連するPrisma Studioを起動します (例: `make prisma-studio service=user-service`)       |

## ドキュメント

- [データベーススキーマ](docs/database/schema.md) - 各サービスで使用されるデータベーススキーマの詳細定義
