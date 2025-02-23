ui = true
disable_mlock = true

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = 1  # 開発環境ではTLSを無効化
}

# 開発環境用の設定
api_addr = "http://127.0.0.1:8200"