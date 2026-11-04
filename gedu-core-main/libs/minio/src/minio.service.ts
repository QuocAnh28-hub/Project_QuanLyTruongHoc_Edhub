import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { Readable } from 'stream';
import { MinioOptions } from './types';
import { MINIO_OPTIONS } from './constants';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client

  constructor(
    @Inject(MINIO_OPTIONS)
    private readonly options: MinioOptions,
  ) {
    this.minioClient = new Client({
      endPoint: this.options.endpoint,
      port: this.options.port,
      useSSL: this.options.useSSL,
      accessKey: this.options.accessKey,
      secretKey: this.options.secretKey,
    });
  }

  async getObject(bucketName: string, objectName: string): Promise<Readable> {
    this.logger.log(`Fetching object ${objectName} from bucket ${bucketName}`);
    try {
      return await this.minioClient.getObject(bucketName, objectName);
    } catch (err) {
      this.logger.error(`Error fetching object from MinIO: ${err.message}`, err.stack);
      throw err;
    }
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    fileBuffer: Buffer,
    mimeType: string,
    isPublic: boolean = false
  ): Promise<string> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName);
        if (isPublic) {
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucketName}/*`],
              },
            ],
          };
          await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }
      }
      await this.minioClient.putObject(bucketName, objectName, fileBuffer, fileBuffer.length, {
        'Content-Type': mimeType,
      });
      return `${bucketName}/${objectName}`;
    } catch (error) {
      this.logger.error(`MinIO upload failed: ${error.message}`);
      throw new Error(`MinIO upload failed: ${error.message}`);
    }
  }

  async generatePresignedUrl(bucketName: string, objectName: string, expiresIn: number = 60 * 60 * 24 * 30): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(bucketName, objectName, expiresIn);
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL: ${error.message}`);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
}
