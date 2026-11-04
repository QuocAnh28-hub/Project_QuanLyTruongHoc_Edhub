#!/bin/bash

set -euo pipefail

# ----------------------------
# 🔧 Configurable parameters
# ----------------------------
HARBOR_DOMAIN="registry.eduhub.com"
HARBOR_PROJECT="${HARBOR_PROJECT:-library}"
HARBOR_CATEGORY="middleware"
IMAGE_TAG="${IMAGE_TAG:-latest}"  # default image tag if not set

# ----------------------------
# 🔐 Check credentials
# ----------------------------
if [[ -z "${HARBOR_USERNAME:-}" || -z "${HARBOR_PASSWORD:-}" ]]; then
  echo "❌ HARBOR_USERNAME or HARBOR_PASSWORD is not set"
  exit 1
fi

# ----------------------------
# 📦 Validate inputs
# ----------------------------
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <image1> [<image2> ...]"
  echo "Example: $0 bitnami/kafka debezium/connect"
  exit 1
fi

# ----------------------------
# 🔐 Login to Harbor
# ----------------------------
echo "🔐 Logging into $HARBOR_DOMAIN..."
echo "$HARBOR_PASSWORD" | docker login "$HARBOR_DOMAIN" --username "$HARBOR_USERNAME" --password-stdin

# ----------------------------
# 🚀 Process each image
# ----------------------------
for SOURCE_IMAGE in "$@"; do
  echo "📦 Pulling docker.io/${SOURCE_IMAGE}:${IMAGE_TAG}"
  docker pull "${SOURCE_IMAGE}:${IMAGE_TAG}"

  SHORT_NAME=$(basename "$SOURCE_IMAGE")
  TARGET_IMAGE="${HARBOR_DOMAIN}/${HARBOR_PROJECT}/${HARBOR_CATEGORY}/${SHORT_NAME}:${IMAGE_TAG}"

  echo "🔄 Tagging ${SOURCE_IMAGE}:${IMAGE_TAG} → ${TARGET_IMAGE}"
  docker tag "${SOURCE_IMAGE}:${IMAGE_TAG}" "$TARGET_IMAGE"

  echo "🚀 Pushing ${TARGET_IMAGE}"
  docker push "$TARGET_IMAGE"

  echo "✅ Successfully pushed ${SHORT_NAME}:${IMAGE_TAG} to Harbor"
done





# # Set Harbor credentials
# export HARBOR_USERNAME=admin
# export HARBOR_PASSWORD=your-password

# # Push Kafka and Debezium images
# ./push-docker-middleware-to-harbor.sh bitnami/kafka debezium/connect

# # Optionally use a different tag
# IMAGE_TAG=2.8.1 ./push-docker-middleware-to-harbor.sh bitnami/kafka
