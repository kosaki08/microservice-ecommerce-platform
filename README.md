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

- ✅ ユーザー認証 (JWT)
- ⏳ 商品API
- ⏳ 注文API
- ⏳ 決済API
- ⏳ WebSocket によるリアルタイム機能

### フロントエンド

- 🚧 Next.js 15 (App Router)
- 🚧 TailwindCSS + Shadcn/ui
- ⏳ React Query
- ⏳ Jest + React Testing Library
- ⏳ Storybook

### データベース

- ✅ Prisma スキーマ定義
- ✅ マイグレーション
- ⏳ シードデータ

## 主な技術スタック

| 区分           | 機能/役割      | 主要技術                                      |
| -------------- | -------------- | --------------------------------------------- |
| Backend        | APIサーバー    | NestJS, Prisma, class-validator, bcryptjs     |
| Frontend       | UIレンダリング | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Database       | データ永続化   | PostgreSQL                                    |
| Monorepo       | コード管理     | Turborepo                                     |
| Packages       | 共通ライブラリ | @portfolio-2025/shared, @portfolio-2025/ui    |
| Authentication | 認証機能       | JWT                                           |
| Monitoring     | 監視           | Prometheus, Grafana, prom-client              |
| Development    | 開発環境       | Docker, Docker Compose, Makefile              |

## ディレクトリ構成

```
.
├── apps/                          # 各アプリケーション
│   ├── frontend/             # Next.js フロントエンド
│   └── backend/
├── packages/                       # 共有ライブラリ
│   ├── ui/                         # 共有UIコンポーネント (React, Tailwind CSS, shadcn/ui)
│   ├── prisma-schemas/             # Prisma スキーマ定義と生成されたクライアント
│   ├── shared/                     # サービス間で共有される型定義やユーティリティ関数
│   ├── eslint-config/              # 共有ESLint設定
│   └── typescript-config/          # 共有TypeScript設定
├── infra/                          # インフラ関連の設定ファイル (Terraform, Vault, Prometheus, Grafana)
├── docker/                         # Docker関連ファイル (Dockerfile, docker-compose.yml)
└── docs/                           # ドキュメント関連ファイル
    └── database/
        └── schema.md               # データベーススキーマ定義
```

## 主な開発コマンド (Makefile)

プロジェクトルートで `make` コマンドを実行することで、一般的なタスクを実行できます。

| コマンド                                                  | 説明                                                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `make help`                                               | 利用可能なコマンドの一覧と説明を表示します                                                                                |
| `make up`                                                 | 開発環境のコンテナ (`backend`, `frontend`, `postgres`等) を起動します (ファイルの変更を監視)                              |
| `make up-build`                                           | コンテナイメージをビルドして起動します                                                                                    |
| `make up-debug`                                           | デバッグ用プロファイル (pgAdmin, Redis Commander など) を含めて起動します                                                 |
| `make up-monitoring`                                      | モニタリング用プロファイル (Prometheus, Grafana) を含めて起動します                                                       |
| `make down`                                               | 全ての開発環境コンテナを停止し、ボリュームも削除します                                                                    |
| `make build`                                              | Dockerイメージをビルドします                                                                                              |
| `make logs service=<app_name>`                            | 指定したアプリ (`backend` or `frontend`) のログを表示します (例: `make logs service=backend`)                             |
| `make exec service=<app_name> cmd="<command>"`            | 指定したアプリ (`backend` or `frontend`) のコンテナ内でコマンドを実行します (例: `make exec service=backend cmd="ls -l"`) |
| `make install-deps service=<app_name> pkg=<package_name>` | 指定したアプリ (`backend` or `frontend`) に依存パッケージを追加します (例: `make install-deps service=backend pkg=axios`) |
| `make prisma-migrate`                                     | DBマイグレーションを実行します                                                                                            |
| `make prisma-generate`                                    | Prisma Clientを生成します                                                                                                 |
| `make prisma-studio`                                      | Prisma Studioを起動します                                                                                                 |

## ドキュメント

- [データベーススキーマ](docs/database/schema.md) - 各サービスで使用されるデータベーススキーマの詳細定義
