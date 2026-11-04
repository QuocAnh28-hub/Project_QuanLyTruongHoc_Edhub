# Makefile for gedu-deploy Middleware Helm Chart
# ----------------------------------------------

CHART_NAME       := gedu-deploy
RELEASE_NAME     := gedu-deploy
ENV              ?= staging
MW_NS            := middleware-$(ENV)

# Helm common options
HELM_VALUES      := -f ./values.yaml -f ./values-$(ENV).yaml --set global.environment=$(ENV)

.PHONY: all help clean lint deps extract-charts \
        install upgrade uninstall preview review diff harbor-login \
        install-staging install-prod upgrade-staging upgrade-prod

## === Default Task ===

all: review

## === Help Section ===

help:
	@echo ""
	@echo "Middleware Deployment Makefile (ENV=$(ENV))"
	@echo ""
	@echo "General:"
	@echo "  help                Show this help message"
	@echo "  clean               Remove build artifacts"
	@echo ""
	@echo "Helm Chart:"
	@echo "  deps                Download and extract chart dependencies"
	@echo "  extract-charts      Extract .tgz files in charts/"
	@echo "  lint                Lint Helm chart"
	@echo ""
	@echo "Install/Upgrade/Uninstall:"
	@echo "  install             Install middleware release into $(MW_NS)"
	@echo "  upgrade             Upgrade middleware release in $(MW_NS)"
	@echo "  uninstall           Uninstall release from $(MW_NS)"
	@echo "  install-staging     Install to staging"
	@echo "  install-prod        Install to prod"
	@echo "  upgrade-staging     Upgrade in staging"
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
	@rm -rf charts/*/ charts/*.tgz Chart.lock

## === Dependency Management ===

harbor-login:
	@echo "Logging in to Harbor registry..."
	@if [ -z "$$HARBOR_USERNAME" ] || [ -z "$$HARBOR_PASSWORD" ]; then \
		echo "ERROR: HARBOR_USERNAME or HARBOR_PASSWORD not set"; exit 1; \
	fi
	@echo "$$HARBOR_PASSWORD" | helm registry login registry.eduhub.com \
		--username "$$HARBOR_USERNAME" \
		--password-stdin

deps: harbor-login
	@echo "Downloading chart dependencies..."
	@helm dependency build .
	@$(MAKE) extract-charts

extract-charts:
	@./scripts/extract-charts.sh

lint:
	@echo "Linting Helm chart..."
	@helm lint .

## === Deployment ===

install:
	@echo "Installing $(RELEASE_NAME) to namespace: $(MW_NS)"
	@kubectl create namespace "$(MW_NS)" --dry-run=client -o yaml | kubectl apply -f -
	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MW_NS) $(HELM_VALUES) --atomic --wait --timeout 5m"; \
	echo "$$cmd"; eval "$$cmd"

upgrade: install

uninstall:
	@echo "Uninstalling $(RELEASE_NAME) from namespace: $(MW_NS)"
	@helm uninstall $(RELEASE_NAME) --namespace $(MW_NS) || true

install-staging:
	@$(MAKE) install ENV=staging

install-prod:
	@$(MAKE) install ENV=prod

upgrade-staging:
	@$(MAKE) upgrade ENV=staging

upgrade-prod:
	@$(MAKE) upgrade ENV=prod

## === Preview & Diff ===

preview:
	@echo "Previewing Helm release $(RELEASE_NAME) in namespace $(MW_NS)"
	@cmd="helm upgrade --install $(RELEASE_NAME) . --namespace $(MW_NS) $(HELM_VALUES) --dry-run --debug"; \
	echo "$$cmd"; eval "$$cmd"

review:
	@$(MAKE) lint
	@$(MAKE) deps
	@$(MAKE) preview

diff:
	@if ! helm plugin list | grep -q diff; then \
		echo "Installing helm-diff plugin..."; \
		helm plugin install https://github.com/databus23/helm-diff; \
	fi
	@echo "Showing Helm diff for $(RELEASE_NAME) in namespace $(MW_NS)"
	@helm diff upgrade $(RELEASE_NAME) . --namespace $(MW_NS) $(HELM_VALUES) || true
