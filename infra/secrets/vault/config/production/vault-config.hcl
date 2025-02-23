ui = true

storage "raft" {
  path = "/vault/data"
  node_id = "node1"
  
  retry_join {
    leader_api_addr = "https://vault:8200"
  }
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_cert_file = "/vault/config/tls/vault.crt"
  tls_key_file  = "/vault/config/tls/vault.key"
}

# 本番環境用の設定
api_addr = "https://vault:8200"
cluster_addr = "https://vault:8201"

# セキュリティ設定
max_lease_ttl = "768h"    # 32日
default_lease_ttl = "168h" # 7日

# 監査ログの設定
audit_non_hmac_request_keys = ["token"]
audit_non_hmac_response_keys = ["token"]