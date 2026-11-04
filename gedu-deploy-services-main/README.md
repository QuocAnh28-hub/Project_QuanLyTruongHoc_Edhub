# gedu-deploy-services

This repository contains an **umbrella Helm chart** for deploying microservices and middleware to Kubernetes. It manages the deployment of the `ms-core` and `ms-import` services along with their dependencies using a unified workflow.

---

## ✨ Features

- **Umbrella Chart**: Deploys `ms-core` and `ms-import` as subcharts
- **Environment Support**: Easily switch between `staging`, `prod`, and other environments using values files
- **Harbor Integration**: Supports pushing/pulling Helm charts and Docker images from a Harbor OCI registry
- **Automated CI/CD**: GitHub Actions workflow for linting, diffing, and deploying

---

## 📁 Repository Structure

```
.
├── Chart.yaml                # Umbrella chart definition
├── values.yaml               # Default values
├── values-prod.yaml          # Production overrides
├── values-nonprod.yaml       # Non-production overrides
├── charts/                   # Chart dependencies (tgz and extracted)
│   ├── ms-core/              # ms-core Helm chart
│   └── ms-import/            # ms-import Helm chart
├── scripts/                  # Utility scripts for chart/image management
├── Makefile                  # Common deployment tasks
└── .github/workflows/        # CI/CD GitHub Actions
```

---

## ✅ Prerequisites

- [Helm 3](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Access to your Kubernetes cluster
- Harbor registry credentials

---

## 🚀 Usage

### 1. Set Harbor Credentials

```sh
export HARBOR_USERNAME=your-username
export HARBOR_PASSWORD=your-password
```

### 2. Install Dependencies

```sh
make deps
```

### 3. Lint the Chart

```sh
make lint
```

### 4. Preview Deployment

```sh
make preview ENV=staging
```

### 5. Deploy to Kubernetes

```sh
make upgrade ENV=staging   # For staging
make upgrade ENV=prod      # For production
```

### 6. Uninstall

```sh
make uninstall ENV=staging
```

---

## ⚙️ CI/CD

Deployment is automated via a [GitHub Actions workflow](.github/workflows/deploy.yml).  
It supports both manual and push-triggered deployments with environment detection and optional approval for production.

---

## 📦 Managing Images and Charts

- Use [`scripts/push-docker-middleware-to-harbor.sh`](scripts/push-docker-middleware-to-harbor.sh) to push Docker images to Harbor.
- Use [`scripts/push-middleware-to-harbor.sh`](scripts/push-middleware-to-harbor.sh) to push Helm charts to Harbor.
- Use [`scripts/extract-charts.sh`](scripts/extract-charts.sh) to extract `.tgz` charts for local development.

---

## 🛠️ Customization

Override values for different environments by editing:

- [`values.yaml`](values.yaml) — base config
- [`values-prod.yaml`](values-prod.yaml) — production overrides
- [`values-nonprod.yaml`](values-nonprod.yaml) — non-production overrides

Example override for `ms-import`:

```yaml
ms-import:
  replicaCount: 2
  image:
    tag: latest
```

---

For more details, see the [Makefile](Makefile) and scripts in the [`scripts/`](scripts/) directory.
