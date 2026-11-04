#!/bin/bash

set -euo pipefail

# ------------------------
# SUPPORTED CHARTS & REPOS
# ------------------------
declare -A CHART_REPOS=(
  [redis]="bitnami|https://charts.bitnami.com/bitnami"
  [kafka]="bitnami|https://charts.bitnami.com/bitnami"
  [strimzi-kafka-operator]="strimzi|https://strimzi.io/charts/"
  [postgresql]="bitnami|https://charts.bitnami.com/bitnami"
  [debezium-operator]="debezium|https://debezium.github.io/charts"
  [kube-prometheus-stack]="prometheus-community|https://prometheus-community.github.io/helm-charts"
)

# ------------------------
# CHARTS TO PROCESS
# ------------------------
CHARTS=("$@")
if [ ${#CHARTS[@]} -eq 0 ]; then
  CHARTS=("${!CHART_REPOS[@]}")
fi

# ------------------------
# HARBOR CONFIG
# ------------------------
HARBOR_DOMAIN="registry.eduhub.com"
HARBOR_PROJECT="library"
HARBOR_CATEGORY="middleware"

# ------------------------
# VALIDATE CREDENTIALS
# ------------------------
if [[ -z "${HARBOR_USERNAME:-}" || -z "${HARBOR_PASSWORD:-}" ]]; then
  echo "❌ HARBOR_USERNAME or HARBOR_PASSWORD not set"
  exit 1
fi

# ------------------------
# LOGIN TO HARBOR
# ------------------------
echo "$HARBOR_PASSWORD" | helm registry login "$HARBOR_DOMAIN" \
  --username "$HARBOR_USERNAME" \
  --password-stdin

# ------------------------
# PROCESS EACH CHART
# ------------------------
for CHART in "${CHARTS[@]}"; do
  echo -e "\n📦 Processing chart: $CHART"

  if [[ -z "${CHART_REPOS[$CHART]+exists}" ]]; then
    echo "❌ Unsupported chart: $CHART"
    continue
  fi

  IFS="|" read -r REPO_NAME REPO_URL <<< "${CHART_REPOS[$CHART]}"
  OCI_REPO="oci://${HARBOR_DOMAIN}/${HARBOR_PROJECT}/${HARBOR_CATEGORY}/${CHART}"

  # Add Helm repo (only for http(s) sources)
  if [[ "$REPO_URL" == http* ]]; then
    helm repo add "$REPO_NAME" "$REPO_URL" >/dev/null 2>&1 || true
    helm repo update >/dev/null 2>&1
  fi

  # Get latest version (skip for OCI-only charts)
  if [[ "$REPO_URL" == http* ]]; then
    LATEST_VERSION=$(helm search repo "${REPO_NAME}/${CHART}" --versions | awk 'NR==2{print $2}')
    if [[ -z "$LATEST_VERSION" ]]; then
      echo "⚠️  Could not find version for $CHART — skipping."
      continue
    fi
  else
    LATEST_VERSION="latest"
  fi

  echo "🔄 Found $CHART version: $LATEST_VERSION"

  # Cleanup old artifacts
  CHART_DIR="chart-${CHART}"
  TAR_NAME="${CHART}-${LATEST_VERSION}.tgz"
  rm -rf "${CHART}" "${CHART_DIR}" "$TAR_NAME"

  # Pull and rename chart dir
  helm pull "${REPO_NAME}/${CHART}" --version "$LATEST_VERSION" --untar
  mv "${CHART}" "${CHART_DIR}"

  # Package without nested path
  helm package "${CHART_DIR}" --version "$LATEST_VERSION" --destination .

  echo "🚀 Pushing $TAR_NAME to $OCI_REPO"
  helm push "$TAR_NAME" "$OCI_REPO" || {
    echo "❌ Failed to push $CHART to Harbor"
    continue
  }

  # Final cleanup
  rm -rf "${CHART_DIR}" "$TAR_NAME"
  echo "✅ $CHART:$LATEST_VERSION pushed to $OCI_REPO"
done
