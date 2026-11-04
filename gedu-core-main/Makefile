SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c

# ------------------------
# CONFIGURATION
# ------------------------

# Set to core or import
SERVICE           ?= core
APP_NAME          := ms-$(SERVICE)

IMAGE_REGISTRY    ?= registry.eduhub.com
DOCKER_USER       ?= $(HARBOR_USERNAME)
DOCKER_PASS       ?= $(HARBOR_PASSWORD)

DOCKER_REPO_DEV   := $(IMAGE_REGISTRY)/dev/$(APP_NAME)
DOCKER_REPO_PROD  := $(IMAGE_REGISTRY)/prod/$(APP_NAME)

CONTEXT           ?= .
PLATFORM          ?= linux/amd64
BUILD_ARGS        ?=

APP_DIR           := apps/$(SERVICE)

HELM_CHART_DIR    ?= helm/$(APP_NAME)
HELM_PACKAGE_DIR  ?= build/helm
VALUES_FILE       ?= $(HELM_CHART_DIR)/values.yaml
CHART_FILE        := $(HELM_CHART_DIR)/Chart.yaml

HELM_REPO_URL     ?= https://$(IMAGE_REGISTRY)/chartrepo/library
HELM_OCI_REPO     ?= oci://$(IMAGE_REGISTRY)/library/$(APP_NAME)

IMAGE_TAG         ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "latest")
HELM_VERSION      ?= $(shell git describe --tags --abbrev=0 2>/dev/null || echo "0.1.0+$(IMAGE_TAG)")

CA_FILE          := /Users/annguyen/Downloads/ca.crt

.DEFAULT_GOAL := help

.PHONY: \
  docker-login docker-build-dev docker-build-prod docker-push-dev docker-push-prod \
  helm-registry-login helm-lint helm-update-values helm-package helm-push \
  bump-helm-version dev-deploy prod-deploy clean help

# ------------------------
# DOCKER TARGETS
# ------------------------

docker-login:
	@echo "Logging in to Docker registry: $(IMAGE_REGISTRY)"
	echo "$(DOCKER_PASS)" | docker login "$(IMAGE_REGISTRY)" -u "$(DOCKER_USER)" --password-stdin

docker-build-dev:
	@echo "Building DEV Docker image: $(DOCKER_REPO_DEV):$(IMAGE_TAG)"
	docker build \
		--file $(APP_DIR)/Dockerfile.dev \
		--platform $(PLATFORM) \
		$(foreach arg,$(BUILD_ARGS),--build-arg $(arg)) \
		--tag $(DOCKER_REPO_DEV):$(IMAGE_TAG) \
		$(CONTEXT)

docker-build-prod:
	@echo "Building PROD Docker image: $(DOCKER_REPO_PROD):$(IMAGE_TAG)"
	docker build \
		--file $(APP_DIR)/Dockerfile \
		--platform $(PLATFORM) \
		$(foreach arg,$(BUILD_ARGS),--build-arg $(arg)) \
		--tag $(DOCKER_REPO_PROD):$(IMAGE_TAG) \
		$(CONTEXT)

docker-push-dev: docker-login docker-build-dev
	@echo "Pushing Docker image to DEV..."
	docker push "$(DOCKER_REPO_DEV):$(IMAGE_TAG)"

docker-push-prod: docker-login docker-build-prod
	@echo "Pushing Docker image to PROD..."
	docker push "$(DOCKER_REPO_PROD):$(IMAGE_TAG)"

# ------------------------
# HELM TARGETS
# ------------------------

helm-registry-login:
	@echo "Logging in to Helm OCI registry..."
	@if [[ -z "$$HARBOR_USERNAME" || -z "$$HARBOR_PASSWORD" ]]; then \
		echo "HARBOR_USERNAME or HARBOR_PASSWORD is not set"; exit 1; \
	fi
	echo "$$HARBOR_PASSWORD" | helm registry login "$(IMAGE_REGISTRY)" \
		--username "$$HARBOR_USERNAME" \
		--password-stdin \
		--ca-file "$(CA_FILE)"

bump-helm-version:
	@echo "Bumping Helm chart version..."
	@current_version=$$(awk '/^version:/ { print $$2 }' "$(CHART_FILE)") && \
	if [ -z "$$current_version" ]; then \
		echo "Error: Could not find version in $(CHART_FILE)" && exit 1; \
	fi && \
	echo "Current version: $$current_version" && \
	IFS='.' read -r major minor patch <<< "$$current_version" && \
	new_version="$$major.$$minor.$$((patch + 1))" && \
	echo "New version: $$new_version" && \
	sed -i.bak "s/^version: .*/version: $$new_version/" "$(CHART_FILE)" && \
	echo "Chart version bumped to $$new_version"

helm-lint:
	@echo "Linting Helm chart..."
	helm lint "$(HELM_CHART_DIR)"

helm-update-values:
	@echo "Updating image tag in values.yaml to: $(IMAGE_TAG)"
	sed -i.bak "s/^\([[:space:]]*tag:\).*/\1 $(IMAGE_TAG)/" "$(VALUES_FILE)"

helm-package: bump-helm-version helm-update-values
	@echo "Packaging Helm chart..."
	mkdir -p "$(HELM_PACKAGE_DIR)"
	@version=$$(awk '/^version:/ { print $$2 }' "$(CHART_FILE)") && \
	echo "Packaging helm file: $(HELM_CHART_DIR) with version: $${version}" && \
	helm package "$(HELM_CHART_DIR)" --version "$${version}" --destination "$(HELM_PACKAGE_DIR)"

helm-push: helm-registry-login helm-package
	@echo "Pushing Helm chart to OCI..."
	@TAR_NAME=$$(ls "$(HELM_PACKAGE_DIR)"/$(APP_NAME)-*.tgz | head -n1) && \
	echo "Pushing helm file: $$TAR_NAME to OCI: $(HELM_OCI_REPO)" && \
	helm push "$$TAR_NAME" "$(HELM_OCI_REPO)" --ca-file "$(CA_FILE)"

# ------------------------
# DEPLOY SHORTCUTS
# ------------------------

dev-deploy: docker-push-dev helm-lint helm-package helm-push

prod-deploy: docker-push-prod helm-lint helm-package helm-push

# ------------------------
# UTILITIES
# ------------------------

clean:
	@echo "Cleaning up build artifacts..."
	rm -rf "$(HELM_PACKAGE_DIR)" "$(VALUES_FILE).bak" "$(CHART_FILE).bak"

help:
	@echo ""
	@echo "Usage: make <target> [SERVICE=name]"
	@echo ""
	@echo "Available SERVICES: core (default), import"
	@echo ""
	@echo "Docker:"
	@echo "  docker-login         - Login to Docker registry"
	@echo "  docker-build-dev     - Build DEV Docker image"
	@echo "  docker-build-prod    - Build PROD Docker image"
	@echo "  docker-push-dev      - Push DEV Docker image"
	@echo "  docker-push-prod     - Push PROD Docker image"
	@echo ""
	@echo "Helm:"
	@echo "  helm-lint            - Lint Helm chart"
	@echo "  helm-update-values   - Update image tag in values.yaml"
	@echo "  helm-package         - Package Helm chart"
	@echo "  helm-push            - Push Helm chart to OCI registry"
	@echo "  bump-helm-version    - Increment patch version in Chart.yaml"
	@echo ""
	@echo "Deploy:"
	@echo "  dev-deploy           - Build/push DEV image & Helm chart"
	@echo "  prod-deploy          - Build/push PROD image & Helm chart"
	@echo ""
	@echo "Utility:"
	@echo "  clean                - Clean generated files"
	@echo "  help                 - Show this help message"