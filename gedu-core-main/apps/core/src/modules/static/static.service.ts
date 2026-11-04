import { Injectable } from '@nestjs/common';
import { MinioService } from '@gedu/minio';

@Injectable()
export class StaticService {
  private minioService: MinioService;

  constructor(private minio: MinioService) {
    this.minioService = minio;
  }

  async getStaticFile(bucketName: string, objectName: string): Promise<string> {
    return await this.minioService.generatePresignedUrl(bucketName, objectName, 1 * 60 * 60); // 1 hour
  }
}