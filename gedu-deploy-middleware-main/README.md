# gedu-middleware Repo

Umbrella Helm chart for deploying middleware services (Redis, Kafka, Debezium Operator) to Kubernetes, with support for multiple environments and OCI registry integration.

---

## ✨ Features

- Deploys Redis, Kafka, and Debezium Operator as subcharts
- Supports production and non-production environments via values files
- OCI registry integration for pulling chart dependencies from Harbor
- Automated deployment workflows with GitHub Actions

---

## 📁 Repository Structure

```
.
├── Chart.yaml                # Helm chart definition and dependencies
├── Makefile                  # Common deployment and management tasks
├── values.yaml               # Base values
├── values-prod.yaml          # Production environment overrides
├── values-nonprod.yaml       # Non-production environment overrides
├── charts/                   # Downloaded chart dependencies
├── scripts/                  # Helper scripts for chart/image management
├── templates/                # Helm templates (if any)
└── .github/workflows/        # CI/CD workflows
```

---

## 🚀 Usage

### ✅ Prerequisites

- [Helm 3](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Access to a Kubernetes cluster
- Harbor registry credentials

---

### 🔧 Common Commands

#### ⬇️ Download Dependencies

```sh
make deps
```

#### 🧹 Lint the Chart

```sh
make lint
```

#### 👀 Preview a Deployment

```sh
make preview ENV=staging
```

#### 🚀 Install / Upgrade

```sh
make install ENV=staging
make upgrade ENV=prod
```

#### 🗑️ Uninstall

```sh
make uninstall ENV=staging
```

---

### 🔐 Harbor Registry Login

```sh
export HARBOR_USERNAME=your-username
export HARBOR_PASSWORD=your-password
make harbor-login
```

---

### 📦 Managing Middleware Images

Use scripts in `scripts/` to push middleware Docker images or Helm charts to Harbor.

Example:

```sh
./scripts/push-helm-chart.sh kafka
./scripts/push-docker-image.sh redis
```

---

## ⚙️ CI/CD

Deployment is automated via a [GitHub Actions workflow](.github/workflows/deploy.yml).  
It supports manual and push-triggered deployments to staging and production environments.

---

## 🔧 Customization

- Edit `values.yaml`, `values-prod.yaml`, or `values-nonprod.yaml` to customize middleware configuration.
- Add or update dependencies in [Chart.yaml](Chart.yaml).
