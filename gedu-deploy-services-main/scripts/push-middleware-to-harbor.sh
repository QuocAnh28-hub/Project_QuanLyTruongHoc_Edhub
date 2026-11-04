#!/bin/bash

set -euo pipefail

# Supported charts and their sources
declare -A CHART_REPOS=(
  [redis]="bitnami|https://charts.bitnami.com/bitnami"
  [kafka]="bitnami|https://charts.bitnami.com/bitnami"
  [postgresql]="bitnami|https://charts.bitnami.com/bitnami"
  [debezium-operator]="debezium|https://debezium.github.io/charts"
)

# Charts to process (default: all)
CHARTS=("$@")
if [ ${#CHARTS[@]} -eq 0 ]; then
  CHARTS=("${!CHART_REPOS[@]}")
fi

# Harbor config
HARBOR_DOMAIN="registry.eduhub.com"
HARBOR_PROJECT="library"
HARBOR_CATEGORY="middleware"  # 👈 group path prefix

# Validate credentials
if [[ -z "${HARBOR_USERNAME:-}" || -z "${HARBOR_PASSWORD:-}" ]]; then
  echo "❌ HARBOR_USERNAME or HARBOR_PASSWORD not set"
  exit 1
fi

# Login once
echo "$HARBOR_PASSWORD" | helm registry login "$HARBOR_DOMAIN" \
  --username "$HARBOR_USERNAME" \
  --password-stdin

for CHART in "${CHARTS[@]}"; do
  echo "📦 Processing chart: $CHART"

  if [[ -z "${CHART_REPOS[$CHART]+exists}" ]]; then
    echo "❌ Unsupported chart: $CHART"
    continue
  fi

  IFS="|" read -r REPO_NAME REPO_URL <<< "${CHART_REPOS[$CHART]}"
  OCI_REPO="oci://${HARBOR_DOMAIN}/${HARBOR_PROJECT}/${HARBOR_CATEGORY}/${CHART}"

  # Add repo and update
  helm repo add "$REPO_NAME" "$REPO_URL" >/dev/null 2>&1 || true
  helm repo update >/dev/null 2>&1

  # Get latest version
  LATEST_VERSION=$(helm search repo "${REPO_NAME}/${CHART}" --versions | awk 'NR==2{print $2}')
  if [[ -z "$LATEST_VERSION" ]]; then
    echo "⚠️  Could not find version for $CHART — skipping."
    continue
  fi

  echo "🔄 Found $CHART version: $LATEST_VERSION"
  helm pull "${REPO_NAME}/${CHART}" --version "$LATEST_VERSION" --untar
  helm package "./${CHART}" --version "$LATEST_VERSION"

  TAR_NAME="${CHART}-${LATEST_VERSION}.tgz"

  echo "🚀 Pushing $TAR_NAME to $OCI_REPO"
  helm push "$TAR_NAME" "$OCI_REPO"

  # Cleanup
  rm -rf "${CHART}" "$TAR_NAME"
  echo "✅ $CHART:$LATEST_VERSION pushed to $OCI_REPO"
done
