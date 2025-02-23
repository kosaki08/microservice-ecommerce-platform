#!/bin/sh

# Vaultの初期化
vault operator init -key-shares=1 -key-threshold=1 > init.txt

# アンシールキーとルートトークンの抽出
UNSEAL_KEY=$(grep 'Unseal Key 1:' init.txt | awk '{print $NF}')
ROOT_TOKEN=$(grep 'Initial Root Token:' init.txt | awk '{print $NF}')

# 環境変数に設定
export VAULT_TOKEN=$ROOT_TOKEN

# ポリシーの適用
vault policy write app-policy /vault/policies/app-policy.hcl

# AppRoleの設定
vault auth enable approle
vault write auth/approle/role/my-role \
  secret_id_ttl=10m \
  token_num_uses=10 \
  token_ttl=20m \
  token_max_ttl=30m \
  secret_id_num_uses=40 \
  policies=app-policy