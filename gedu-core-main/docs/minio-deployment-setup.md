# Harbor Registry Deployment Setup Guide

This document outlines the setup for using Harbor Registry to manage Docker images in the CI/CD pipeline instead of file-based storage.

## Overview

The GitHub Actions workflow has been modified to:
1. Build and push Docker images to Harbor Registry during the build phase
2. Pull images from Harbor Registry during deployment
3. Use first 6 characters of commit hash as image tags for versioning
4. Consolidate environment variables directly into docker-compose.yml

## Harbor Registry Configuration

### Registry Details
- **Registry URL**: `registry.lazeout.com`
- **Username**: `gedu`
- **Password**: `Admin1Gedu`
- **Project**: `gedu`

### Required GitHub Secrets

You need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `ENV_DEV` | Development environment variables | All environment variables in KEY=VALUE format |
| `SERVER_HOST` | Deployment server hostname | `your-server.com` |
| `SERVER_USER` | SSH username for deployment | `deploy` |
| `SERVER_SSH_PRIVATE_KEY` | SSH private key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

## Harbor Registry Structure

The workflow pushes images to Harbor Registry with the following structure:
```
registry.lazeout.com/gedu/
├── core:dev          # Latest development image
├── core:{6-char-sha} # Specific commit version
├── import:dev        # Latest development image
├── import:{6-char-sha} # Specific commit version
├── migrate:latest    # Latest migration image
└── migrate:{6-char-sha} # Specific commit version
```

### Image Tagging Strategy
- **Short SHA Tags**: Uses first 6 characters of commit hash (e.g., `a1b2c3`)
- **Environment Tags**: `dev` for applications, `latest` for migrations
- **Versioning**: Each commit creates a unique versioned image

## Workflow Changes Summary

### Build Jobs (`build-affected` & `build-migration`)
- **Added**: Docker login to Harbor Registry using `docker/login-action@v3`
- **Added**: Short SHA generation (first 6 characters of commit hash)
- **Changed**: Push images to Harbor Registry using `docker push`
- **Added**: Dual tagging strategy (SHA-based and environment-based)
- **Removed**: File compression and MinIO operations
- **Added**: Local image cleanup after push

### Deploy Job
- **Removed**: GitHub artifact download step
- **Removed**: MinIO Client installation and operations
- **Changed**: Copy only docker-compose.yml and single .env file to server
- **Added**: Docker login to Harbor Registry on deployment server
- **Added**: Direct image pull from Harbor Registry using `docker pull`
- **Added**: Local image tagging for deployment compatibility
- **Simplified**: No file extraction or compression operations
- **Added**: Local Docker image cleanup using `docker image prune`

## Benefits

1. **Standard Docker Workflow**: Uses industry-standard Docker registry operations
2. **Harbor Registry Features**: Built-in vulnerability scanning, image signing, and access control
3. **Network Efficiency**: Images pulled directly on deployment server (no double transfer)
4. **Performance**: Faster deployment with native Docker operations
5. **Version Control**: Clear versioning with commit-based tags
6. **Simplified Operations**: Standard `docker push` and `docker pull` commands
7. **Environment Consolidation**: All environment variables in docker-compose.yml
8. **Reduced Complexity**: No file compression, extraction, or custom storage operations
9. **Better Debugging**: Standard Docker tooling and logging
10. **Scalability**: Harbor Registry designed for enterprise container management
11. **Reduced GitHub Actions Runtime**: Minimal time spent in CI/CD pipeline

## Monitoring and Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify MinIO credentials in GitHub secrets
2. **Bucket Not Found**: Ensure the `docker-images` bucket exists
3. **Network Issues**: Check MinIO endpoint URL and network connectivity
4. **Permission Issues**: Verify MinIO user has read/write permissions
5. **MinIO Client Errors**: Check mc command exit codes and error messages

### Debugging

Check the GitHub Actions logs for:
- MinIO Client (mc) command success/failure messages
- mc cp, mc ls, mc rm operation results
- Image upload/download operations
- Image loading on the deployment server

### Manual Cleanup

If needed, you can manually clean up old images using MinIO Client:
```bash
# Configure mc alias (one time setup)
mc alias set minio-deploy https://your-minio-server.com access-key secret-key

# List all images in the bucket
mc ls --recursive minio-deploy/imgs/dev/

# Remove specific images
mc rm minio-deploy/imgs/dev/core/old-commit-sha.tar

# Remove multiple images with pattern
mc rm --recursive minio-deploy/imgs/dev/core/
```

## MinIO User Permissions

The MinIO user needs the following permissions for the `docker-images` bucket:

### Required Permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::docker-images",
        "arn:aws:s3:::docker-images/*"
      ]
    }
  ]
}
```

### Creating MinIO User (via MinIO Console or CLI):
```bash
# Create user
mc admin user add your-minio-alias deployment-user deployment-password

# Create policy file (save as deployment-policy.json)
cat > deployment-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::docker-images",
        "arn:aws:s3:::docker-images/*"
      ]
    }
  ]
}
EOF

# Create and attach policy
mc admin policy add your-minio-alias deployment-policy deployment-policy.json
mc admin policy set your-minio-alias deployment-policy user=deployment-user
```

## Security Considerations

1. **Access Keys**: Use dedicated MinIO user with minimal required permissions (see above)
2. **Network**: Consider using VPC/private networks for MinIO access
3. **Encryption**: Enable server-side encryption if handling sensitive images
4. **Backup**: Regular backup of the MinIO bucket if needed

## Migration from Artifacts

The workflow will automatically work with the new MinIO setup once the secrets are configured. No manual migration of existing artifacts is needed as they will be replaced by new builds.