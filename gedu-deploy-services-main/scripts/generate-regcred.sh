#!/bin/bash

REGISTRY="registry.eduhub.com"
USERNAME="ci-deploy"
# PASSWORD=$(openssl rand -base64 24)  # or hardcode a password if needed
PASSWORD="W4wPPvJQdAM"  # Replace with your actual password
NAMESPACE="ms-service-prod"
SECRET_NAME="regcred"

# Encode credentials (username:password)
AUTH_BASE64=$(echo -n "$USERNAME:$PASSWORD" | base64 -w0)

# Construct minimal .dockerconfigjson
CONFIG_JSON=$(cat <<EOF
{
  "auths": {
    "$REGISTRY": {
      "auth": "$AUTH_BASE64"
    }
  }
}
EOF
)

# Encode JSON to base64
ENCODED_JSON=$(echo "$CONFIG_JSON" | base64 -w0)

# Output the Kubernetes secret YAML
cat <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: $SECRET_NAME
  namespace: $NAMESPACE
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: $ENCODED_JSON
EOF
