# Vault Service

## 概要

シークレット管理と認証を担当するマイクロサービスです。  
HashiCorp Vaultを統合し、環境変数の暗号化やキーローテーションを管理します。

## アーキテクチャ

- **フレームワーク**: NestJS
- **API**: REST APIを提供
- **連携**: HashiCorp Vaultと連携し、シークレットの安全な管理を行います。

## 依存関係

- HashiCorp Vault
- NestJS
