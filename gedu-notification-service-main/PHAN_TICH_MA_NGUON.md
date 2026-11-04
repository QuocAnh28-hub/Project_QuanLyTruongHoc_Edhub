# Phân Tích Mã Nguồn - Gedu Notification Service

## 📋 Tổng Quan Dự Án

**Gedu Notification Service** là một microservice được xây dựng bằng **NestJS** và **Nx** để xử lý các thông báo email thông qua Kafka. Service này hỗ trợ gửi email qua nhiều phương thức khác nhau (SMTP, MailerSend API, Microsoft Graph API).

---

## 🏗️ Kiến Trúc Hệ Thống

### Cấu Trúc Thư Mục

```
apps/notification/
├── src/
│   ├── app.module.ts              # Module chính của ứng dụng
│   ├── main.ts                    # Entry point, khởi động service
│   ├── config/                    # Cấu hình Kafka và Mailer
│   │   ├── kafka.config.ts        # Cấu hình Kafka consumer/producer
│   │   └── mailer.config.ts       # Cấu hình SMTP/Nodemailer
│   ├── email/                     # Module xử lý email
│   │   ├── email.service.ts       # Service chính xử lý email
│   │   ├── email.module.ts        # Email module
│   │   ├── email.constants.ts     # Constants và config email
│   │   └── repositories/          # Các repository gửi email
│   │       ├── mailersend.repository.ts  # MailerSend API
│   │       └── ms-graph.repository.ts    # Microsoft Graph API
│   ├── notification/              # Module xử lý notification đa loại
│   │   ├── notification.service.ts
│   │   ├── notification.controller.ts    # Kafka event handlers
│   │   └── notification.module.ts
│   ├── health/                    # Health check endpoints
│   ├── redis/                     # Redis service (cache tokens)
│   ├── templates/                 # Handlebars email templates
│   │   ├── activate-school-admin.hbs
│   │   ├── activate-staff.hbs
│   │   ├── change-password.hbs
│   │   ├── import-file-status.hbs
│   │   └── reset-password.hbs
│   └── types/                     # TypeScript type definitions
```

---

## 🔧 Công Nghệ Sử Dụng

### Core Framework & Libraries
- **NestJS** (v11.x) - Framework chính
- **Nx** (v21.2.2) - Monorepo workspace
- **TypeScript** (v5.8.2)
- **KafkaJS** (v2.2.4) - Kafka client
- **Handlebars** (v4.7.8) - Email template engine
- **Nodemailer** (v7.0.5) - SMTP client
- **MailerSend** (v2.6.0) - MailerSend API client
- **Axios** (v1.6.0) - HTTP client cho MS Graph API
- **Redis** (@keyv/redis) - Caching access tokens

### Build & Deployment
- **Webpack** - Bundler
- **Docker** - Containerization
- **Helm** - Kubernetes deployment
- **pnpm** - Package manager

---

## 🚀 Cách Chạy Dự Án

### 1. Yêu Cầu Môi Trường

#### Phần Mềm Cần Cài Đặt:
- **Node.js** (LTS version, khuyến nghị v20+)
- **pnpm** (v10.14.0) - Package manager
- **Docker** & **Docker Compose** (nếu chạy bằng Docker)
- **Kafka** (localhost:9092 hoặc remote)
- **Redis** (localhost:6379 hoặc remote)

#### Biến Môi Trường Cần Thiết:

Tạo file `.env` từ `env.example`:

```bash
# SMTP Configuration (cho Nodemailer)
SMTP_HOST=smtp.mailersend.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_CIPHERS=SSLv3

# MailerSend API (Primary method)
MAILERSEND_API=your-mailersend-api-key

# Microsoft Graph API (Fallback method)
MS_GRAPH_TENANT_ID=your-tenant-id
MS_GRAPH_CLIENT_ID=your-client-id
MS_GRAPH_CLIENT_SECRET=your-client-secret

# Mail Configuration
MAIL_FROM="Hỗ Trợ - G-Edu <no-reply@gedu.vn>"
WEB_ACCESS_LINK=https://gedu.vn
WEB_SUPPORT_EMAIL=hotro@gedu.vn
WEB_SUPPORT_PHONE=0931 441 213

# Infrastructure
KAFKA_BROKERS=localhost:9092
REDIS_URL=localhost:6379

# Application
PORT=3005
NODE_ENV=development
```

### 2. Cài Đặt Dependencies

```bash
# Cài đặt pnpm (nếu chưa có)
npm install -g pnpm@10.14.0

# Cài đặt dependencies
pnpm install
```

### 3. Chạy Development Mode

#### Option 1: Chạy trực tiếp với Nx

```bash
# Build và chạy service
npx nx serve @gedu/notification

# Hoặc chỉ build
npx nx build @gedu/notification
```

#### Option 2: Chạy với Docker Compose

```bash
# Build và chạy service
docker-compose up --build

# Chạy ở background
docker-compose up -d

# Xem logs
docker-compose logs -f notification
```

#### Option 3: Build Docker image riêng

```bash
# Build image
docker build -f apps/notification/Dockerfile -t gedu-notification .

# Chạy container
docker run -p 3005:3000 \
  -e SMTP_HOST=... \
  -e KAFKA_BROKERS=... \
  -e REDIS_URL=... \
  gedu-notification
```

### 4. Kiểm Tra Service Đã Chạy

```bash
# Health check endpoint
curl http://localhost:3005/health

# Response mong đợi:
# { "status": "ok" }
```

---

## 📨 Cách Hoạt Động

### Luồng Xử Lý Email

1. **Nhận Message từ Kafka**
   - Service lắng nghe topic: `gedu.notification.send.email`
   - Controller: `NotificationController.handleSendEmailNotification()`

2. **Xử Lý Notification**
   - `NotificationService.sendNotification()` xác định loại notification
   - Với email: gọi `EmailService.sendWithRetry()`

3. **Gửi Email với Retry Logic**
   - **Attempt 1-3**: Thử gửi qua **MailerSend API**
   - Nếu thất bại: Fallback sang **Microsoft Graph API**
   - Retry với delay 10 giây giữa các lần thử

4. **Render Template**
   - Sử dụng Handlebars để render template từ `templates/`
   - Inject context data vào template

5. **Gửi Email**
   - MailerSend: Gửi qua MailerSend API
   - MS Graph: Gửi qua Microsoft Graph API (cần access token từ Redis)

### Các Template Email Hỗ Trợ

1. **activate-school-admin** - Kích hoạt tài khoản admin trường
2. **activate-staff** - Kích hoạt tài khoản nhân viên
3. **reset-password** - Khôi phục mật khẩu
4. **change-password** - Thay đổi mật khẩu
5. **import-file-status** - Kết quả import file

### Kafka Topics

- **Topic**: `gedu.notification.send.email`
- **Consumer Group**: `email-consumer`
- **Client ID**: `email-service`

### Payload Format

```typescript
{
  type: 'email',
  to: string | string[],           // Email người nhận
  subject: string,                 // Tiêu đề email
  template: string,                // Tên template (không có .hbs)
  metadata: {                      // Context data cho template
    // Tùy theo template:
    // - activate-school-admin: schoolName, adminName, email, password
    // - activate-staff: schoolName, staffName, email, password
    // - reset-password: staffName, username, password
    // - change-password: staffName
    // - import-file-status: fileName, totalCount, successCount, failureCount
  }
}
```

---

## 🐳 Docker & Deployment

### Docker Build

```bash
# Build với Makefile
make docker-build-dev

# Hoặc build trực tiếp
docker build -f apps/notification/Dockerfile -t gedu-notification .
```

### Docker Compose

File `docker-compose.yml` đã được cấu hình sẵn với:
- Port mapping: `3005:3000`
- Environment variables từ `.env`
- Health check
- Auto restart

### Kubernetes Deployment (Helm)

```bash
# Build và push Docker image
make docker-push-dev

# Package Helm chart
make helm-package

# Deploy với Helm
helm install ms-notification ./helm/ms-notification
```

---

## 🔍 Kiểm Tra & Debug

### Logs

Service sử dụng NestJS Logger để log:
- Email gửi thành công/thất bại
- Retry attempts
- Kafka message processing
- MS Graph token refresh

### Health Check

```bash
curl http://localhost:3005/health
```

### Test Gửi Email

Có thể test bằng cách publish message vào Kafka topic:

```bash
# Sử dụng kafka-console-producer
kafka-console-producer --broker-list localhost:9092 --topic gedu.notification.send.email

# Paste JSON payload:
{
  "type": "email",
  "to": "test@example.com",
  "subject": "Test Email",
  "template": "activate-school-admin",
  "metadata": {
    "schoolName": "Test School",
    "adminName": "Test Admin",
    "email": "test@example.com",
    "password": "123456"
  }
}
```

---

## ⚙️ Cấu Hình Chi Tiết

### Kafka Configuration

- **Brokers**: Từ env `KAFKA_BROKERS` (mặc định: `localhost:9092`)
- **Auto Topic Creation**: Enabled
- **Retry**: 5 lần với initial delay 100ms

### Email Providers

1. **MailerSend** (Primary)
   - Sử dụng API key từ `MAILERSEND_API`
   - Gửi qua MailerSend SDK

2. **Microsoft Graph** (Fallback)
   - OAuth2 client credentials flow
   - Access token được cache trong Redis (tránh request liên tục)
   - Token tự động refresh khi hết hạn

3. **SMTP/Nodemailer** (Backup)
   - Cấu hình qua `SMTP_*` env vars
   - Hiện tại không được sử dụng trong retry logic

### Redis Usage

- Cache Microsoft Graph access tokens
- TTL: Theo token expiration từ MS Graph response

---

## 📝 Các File Quan Trọng

### 1. `main.ts`
- Khởi tạo NestJS app
- Kết nối Kafka microservice
- Start HTTP server trên port 3005

### 2. `notification.controller.ts`
- Xử lý Kafka events từ topic `gedu.notification.send.email`
- Parse payload và gọi NotificationService

### 3. `email.service.ts`
- Logic retry và fallback giữa MailerSend và MS Graph
- Render templates và gửi email

### 4. `mailersend.repository.ts` & `ms-graph.repository.ts`
- Implement chi tiết cách gửi email qua từng provider
- Render Handlebars templates

---

## 🚨 Lưu Ý Quan Trọng

1. **Kafka phải chạy trước** khi start service
2. **Redis cần thiết** nếu sử dụng MS Graph (để cache tokens)
3. **Templates** phải có trong `src/templates/` với đúng tên
4. **Environment variables** phải được set đầy đủ
5. Service sẽ **auto-retry** nếu MailerSend fail, fallback sang MS Graph
6. Port mặc định: **3005** (có thể override bằng `PORT` env)

---

## 📚 Tài Liệu Tham Khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [Nx Documentation](https://nx.dev/)
- [KafkaJS Documentation](https://kafka.js.org/)
- [MailerSend API](https://developers.mailersend.com/)
- [Microsoft Graph API](https://learn.microsoft.com/en-us/graph/)

---

## 🛠️ Troubleshooting

### Service không kết nối được Kafka
- Kiểm tra `KAFKA_BROKERS` env var
- Đảm bảo Kafka đang chạy và accessible
- Check firewall/network

### Email không gửi được
- Kiểm tra `MAILERSEND_API` hoặc `MS_GRAPH_*` credentials
- Xem logs để biết lỗi cụ thể
- Verify template files tồn tại

### Redis connection error
- Kiểm tra `REDIS_URL`
- Redis chỉ cần thiết nếu dùng MS Graph fallback

---

**Tạo bởi:** Auto Analysis  
**Ngày:** $(date)  
**Version:** 1.0.0

