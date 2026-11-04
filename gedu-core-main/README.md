# GEdu Core - School Management System

A provincial-level school management system built with **NestJS** (Fastify), **Nx**, and **Prisma ORM** for PostgreSQL, designed for scalability, security, and performance at massive data scale.

---

## 🚀 Features
- **Nx Monorepo**: Modular, scalable architecture
- **NestJS + Fastify**: High-performance backend
- **Prisma ORM**: Type-safe, efficient DB access
- **PostgreSQL**: Robust, indexed relational DB
- **Microservices**: gRPC, Kafka, RabbitMQ ready
- **Authentication**: JWT, Passport, Guards
- **User/Role Management**: Students, Teachers, Staff
- **School/Department/Class Management**
- **Administrative Units**
- **Import/Export System**
- **MinIO File Storage**
- **Swagger API Docs**
- **Rate Limiting, Caching (Redis)**
- **Testing & CI/CD**

---

## 🏗️ Project Structure

```
gedu-core/
├── apps/
│   ├── core/      # Main API (NestJS + Fastify)
│   └── import/    # Import microservice
├── libs/
│   ├── auth/      # Auth/JWT/Guards
│   ├── config/    # App/DB/Auth config
│   ├── email/     # Email service
│   ├── http/      # HTTP utils, filters, interceptors
│   ├── minio/     # MinIO storage
│   ├── prisma/    # PrismaService, DB access
│   ├── redis/     # Redis cache module
│   ├── shared/    # Decorators, DTOs, enums, utils
│   ├── transport/ # gRPC, Kafka
│   └── ...
├── prisma/        # DB schema & migrations
├── docker/        # Docker configs
└── ...
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+

### Install & Bootstrap
```bash
pnpm install
cp sample-env/.env.example .env
cp sample-env/.env.core.example .env.core
cp sample-env/.env.import.example .env.import
```

### Database
```bash
pnpm prisma:generate   # Generate Prisma client
pnpm prisma:migrate    # Run migrations
pnpm prisma:seed       # Seed initial data
```

### Run Services
```bash
pnpm start:dev         # All services (dev)
pnpm start:dev:core    # Core API only
pnpm start:dev:import  # Import service only
```

### Build & Deploy
```bash
pnpm build             # Build all
pnpm build:core        # Build core
pnpm build:import      # Build import
```

---

## 🧩 Nx & Modular Best Practices
- Use `nest generate module|controller|service` for structure
- Each module: `/src/{module}/{module}.module.ts`, etc.
- Use DTOs with `class-validator` for input validation
- Keep controllers thin, business logic in services
- Use dependency injection everywhere
- Use explicit `select` in Prisma queries for performance
- Use pagination (`skip`, `take`) for large queries
- Use transactions for multi-table operations
- Add DB indexes for frequently queried fields
- Use environment variables for secrets
- Use guards for route protection
- Use Redis for caching, Bull for async jobs
- Document APIs with Swagger (`@nestjs/swagger`)
- Write JSDoc for all major code

---

## 🧪 Testing & Quality
- Unit tests: Jest (`*.spec.ts`)
- Integration tests: API endpoints, DB
- 80%+ coverage for critical modules
- Use exception filters for error handling
- Use `@nestjs/throttler` for rate limiting
- Lint and format code before PRs

---

## 🐳 Docker & Deployment
- Use Docker Compose for local dev/prod
- Use Kubernetes for cloud deployment
- Monitor with Prometheus, Grafana
- Log to CloudWatch/ELK

---

## 📚 API & Libraries
- RESTful APIs, OpenAPI docs at `/api`
- Use TypeScript path aliases for shared libs:
```ts
import { PrismaService } from '@gedu/prisma';
import { RedisService } from '@gedu/redis';
```
- See each `libs/*/README.md` for details

---

## 🤝 Contributing
- Branch, code, test, PR
- Follow NestJS, Nx, and workspace best practices
- Document new modules in their README

---

## 👥 Contributors

Thanks to these wonderful people who make GEdu Core possible:

| Avatar | Name | Role | GitHub |
|--------|------|------|--------|
| <img src="https://github.com/sunn-v.png" width="50px" /> | An Nguyen | Tech Lead | [@sunn-v](https://github.com/sunn-v) |
| <img src="https://github.com/nguyen-dc.png" width="50px" /> | Nguyen DC | Team Lead | [@nguyen-dc](https://github.com/nguyen-dc) |
| <img src="https://github.com/thangduonghuu.png" width="50px" /> | Thang Duong | Core Developer | [@thangduonghuu](https://github.com/thangduonghuu) |
| <img src="https://github.com/duyvu997.png" width="50px" /> | Duy Vu | Core Developer | [@duyvu997](https://github.com/duyvu997) |
| <img src="https://github.com/datnq1993.png" width="50px" /> | Dat Nguyen | Core Developer | [@datnq1993](https://github.com/datnq1993) |
| <img src="https://github.com/phu-mai-edu.png" width="50px" /> | Minh Phu | CI/CD Developer | [@phu-mai-edu](https://github.com/phu-mai-edu) |
| <img src="https://github.com/quyenedu.png" width="50px" /> | Quyen Huynh | PM & QC | [@quyenedu](https://github.com/quyenedu) |

---

## 📄 License
MIT License - see LICENSE 