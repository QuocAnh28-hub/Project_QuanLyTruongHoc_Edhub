# Makefile for gedu-deploy-service Helm Chart
# -------------------------------------------

CHART_NAME       := gedu-deploy
RELEASE_NAME     := gedu-deploy
ENV              ?= nonprod
MS_NS            := ms-service-$(ENV)

MERGE_SCRIPT     := ./scripts/merge-values.sh
MERGED_FILE      := values-$(ENV).yaml
HELM_VALUES      := -f ./values.yaml -f ./$(MERGED_FILE) --set global.environment=$(ENV)

CA_FILE          := /Users/annguyen/Downloads/ca.crt

.PHONY: all help clean lint deps extract-charts \
        install upgrade uninstall preview review diff harbor-login \
        install-nonprod install-prod upgrade-nonprod upgrade-prod \
        merge-values show-values

## === Default Task ===

all: review

## === Help Section ===

help:
	@echo ""
	@echo "Microservices Deployment Makefile (ENV=$(ENV))"
	@echo ""
	@echo "General:"
	@echo "  help                Show this help message"
	@echo "  clean               Remove build artifacts"
	@echo "  show-values         Show the merged values-$(ENV).yaml"
	@echo ""
	@echo "Helm Chart:"
	@echo "  deps                Download and extract chart dependencies"
	@echo "  extract-charts      Extract .tgz files in charts/"
	@echo "  lint                Lint Helm chart"
	@echo ""
	@echo "Install/Upgrade/Uninstall:"
	@echo "  install             Install release into $(MS_NS)"
	@echo "  upgrade             Upgrade release in $(MS_NS)"
	@echo "  uninstall           Uninstall release from $(MS_NS)"
	@echo "  install-nonprod     Install to nonprod"
	@echo "  install-prod        Install to prod"
	@echo "  upgrade-nonprod     Upgrade in nonprod"
	@echo "  upgrade-prod        Upgrade in prod"
	@echo ""
	@echo "Preview & Diff:"
	@echo "  preview             Dry-run Helm preview"
	@echo "  review              Run lint, deps, and preview"
	@echo "  diff                Show Helm diff"
	@echo ""
	@echo "Registry:"
	@echo "  harbor-login        Login to Harbor OCI registry"
	@echo ""

## === Clean Up ===

clean:
	@echo "Cleaning up chart artifacts..."
	@rm -rf charts/*/ charts/*.tgz Chart.lock values-prod.yaml values-nonprod.yaml

## === Dependency Management ===

harbor-login:
	@echo "Logging in to Harbor registry..."
	@if [ -z "$$HARBOR_USERNAME" ] || [ -z "$$HARBOR_PASSWORD" ]; then \
		echo "ERROR: HARBOR_USERNAME or HARBOR_PASSWORD not set"; exit 1; \
	fi
	@echo "$$HARBOR_PASSWORD" | helm registry login registry.eduhub.com \
		--username "$$HARBOR_USERNAME" \
		--password-stdin \
		--ca-file $(CA_FILE)

deps: harbor-login
	@echo "Downloading chart dependencies..."
	@helm dependency build . --ca-file $(CA_FILE)
	@$(MAKE) extract-charts

extract-charts:
	@./scripts/extract-charts.sh

lint:
	@echo "Linting Helm chart..."
	@helm lint .

## === Merge Values ===

merge-values:
	@echo "Merging values for environment: $(ENV)"
	@$(MERGE_SCRIPT) $(ENV)

show-values: merge-values
	@echo "===== $(MERGED_FILE) ====="
	@cat $(MERGED_FILE)

## === Deployment ===

install: merge-values
	@echo "Installing $(RELEASE_NAME) to namespace: $(MS_NS)"
	@kubectl create namespace "$(MS_NS)" --dry-run=client -o yaml | kubectl apply -f -
	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) --wait --timeout 5m"; \
	echo "$$cmd"; eval "$$cmd"

upgrade: install

uninstall:
	@echo "Uninstalling $(RELEASE_NAME) from namespace: $(MS_NS)"
	@helm uninstall $(RELEASE_NAME) --namespace $(MS_NS) || true

install-nonprod:
	@$(MAKE) install ENV=nonprod

install-prod:
	@$(MAKE) install ENV=prod

upgrade-nonprod:
	@$(MAKE) upgrade ENV=nonprod

upgrade-prod:
	@$(MAKE) upgrade ENV=prod

## === Preview & Diff ===

preview: merge-values
	@echo "Previewing Helm release $(RELEASE_NAME) in namespace $(MS_NS)"
	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) --dry-run --debug"; \
	echo "$$cmd"; eval "$$cmd"

review: merge-values lint deps preview

diff: merge-values
	@if ! helm plugin list | grep -q diff; then \
		echo "Installing helm-diff plugin..."; \
		helm plugin install https://github.com/databus23/helm-diff; \
	fi
	@echo "Showing Helm diff for $(RELEASE_NAME) in namespace $(MS_NS)"
	@helm diff upgrade $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) || true



# # Makefile for gedu-deploy-service Helm Chart
# # -------------------------------------------

# CHART_NAME       := gedu-deploy
# RELEASE_NAME     := gedu-deploy
# ENV              ?= nonprod
# MS_NS            := ms-service-$(ENV)

# HELM_VALUES      := -f ./values.yaml -f ./values-$(ENV).yaml --set global.environment=$(ENV)

# .PHONY: all help clean lint deps extract-charts \
#         install upgrade uninstall preview review diff harbor-login \
#         install-nonprod install-prod upgrade-nonprod upgrade-prod

# ## === Default Task ===

# all: review

# ## === Help Section ===

# help:
# 	@echo ""
# 	@echo "Microservices Deployment Makefile (ENV=$(ENV))"
# 	@echo ""
# 	@echo "General:"
# 	@echo "  help                Show this help message"
# 	@echo "  clean               Remove build artifacts"
# 	@echo ""
# 	@echo "Helm Chart:"
# 	@echo "  deps                Download and extract chart dependencies"
# 	@echo "  extract-charts      Extract .tgz files in charts/"
# 	@echo "  lint                Lint Helm chart"
# 	@echo ""
# 	@echo "Install/Upgrade/Uninstall:"
# 	@echo "  install             Install release into $(MS_NS)"
# 	@echo "  upgrade             Upgrade release in $(MS_NS)"
# 	@echo "  uninstall           Uninstall release from $(MS_NS)"
# 	@echo "  install-nonprod     Install to nonprod"
# 	@echo "  install-prod        Install to prod"
# 	@echo "  upgrade-nonprod     Upgrade in nonprod"
# 	@echo "  upgrade-prod        Upgrade in prod"
# 	@echo ""
# 	@echo "Preview & Diff:"
# 	@echo "  preview             Dry-run Helm preview"
# 	@echo "  review              Run lint, deps, and preview"
# 	@echo "  diff                Show Helm diff"
# 	@echo ""
# 	@echo "Registry:"
# 	@echo "  harbor-login        Login to Harbor OCI registry"
# 	@echo ""

# ## === Clean Up ===

# clean:
# 	@echo "Cleaning up chart artifacts..."
# 	@rm -rf charts/*/ charts/*.tgz Chart.lock

# ## === Dependency Management ===

# harbor-login:
# 	@echo "Logging in to Harbor registry..."
# 	@if [ -z "$$HARBOR_USERNAME" ] || [ -z "$$HARBOR_PASSWORD" ]; then \
# 		echo "ERROR: HARBOR_USERNAME or HARBOR_PASSWORD not set"; exit 1; \
# 	fi
# 	@echo "$$HARBOR_PASSWORD" | helm registry login registry.eduhub.com \
# 		--username "$$HARBOR_USERNAME" \
# 		--password-stdin

# deps: harbor-login
# 	@echo "Downloading chart dependencies..."
# 	@helm dependency build .
# 	@$(MAKE) extract-charts

# extract-charts:
# 	@./scripts/extract-charts.sh

# lint:
# 	@echo "Linting Helm chart..."
# 	@helm lint .

# ## === Deployment ===

# install:
# 	@echo "Installing $(RELEASE_NAME) to namespace: $(MS_NS)"
# 	@kubectl create namespace "$(MS_NS)" --dry-run=client -o yaml | kubectl apply -f -
# 	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) --wait --timeout 5m"; \
# 	echo "$$cmd"; eval "$$cmd"
#     #@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) --atomic --wait --timeout 5m"; \
	

# upgrade: install

# uninstall:
# 	@echo "Uninstalling $(RELEASE_NAME) from namespace: $(MS_NS)"
# 	@helm uninstall $(RELEASE_NAME) --namespace $(MS_NS) || true

# install-nonprod:
# 	@$(MAKE) install ENV=nonprod

# install-prod:
# 	@$(MAKE) install ENV=prod

# upgrade-nonprod:
# 	@$(MAKE) upgrade ENV=nonprod

# upgrade-prod:
# 	@$(MAKE) upgrade ENV=prod

# ## === Preview & Diff ===

# preview:
# 	@echo "Previewing Helm release $(RELEASE_NAME) in namespace $(MS_NS)"
# 	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) --dry-run --debug"; \
# 	echo "$$cmd"; eval "$$cmd"

# review:
# 	@$(MAKE) lint
# 	@$(MAKE) deps
# 	@$(MAKE) preview

# diff:
# 	@if ! helm plugin list | grep -q diff; then \
# 		echo "Installing helm-diff plugin..."; \
# 		helm plugin install https://github.com/databus23/helm-diff; \
# 	fi
# 	@echo "Showing Helm diff for $(RELEASE_NAME) in namespace $(MS_NS)"
# 	@helm diff upgrade $(RELEASE_NAME) . --namespace $(MS_NS) $(HELM_VALUES) || true
