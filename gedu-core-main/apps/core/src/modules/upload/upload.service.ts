import { Inject, Injectable } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { v4 as uuidv4 } from 'uuid';
import { MinioService } from '@gedu/minio';
import { MINIO_CONFIG_KEY, MinioConfig } from '@gedu/config';
import { buildURL } from '@gedu/shared';

/**
 * Service for handling file uploads using MinIO storage.
 * Provides functionality to upload files to public or private buckets.
 */
@Injectable()
export class UploadService {
  /**
   * Constructor for UploadService.
   * @param minioConfig - MinIO configuration settings
   * @param minioService - Service for MinIO operations
   */
  constructor(
    @Inject(MINIO_CONFIG_KEY)
    private minioConfig: MinioConfig,
    private minioService: MinioService
  ) {}

  async uploadFile(typeData: {type: string, isPublic: boolean}, file: { filename: string; mimetype: string; file: MultipartFile }): Promise<string> {
    const fileExtension = file.filename.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const {type, isPublic} = typeData;
    try {
      const fileBuffer = await file.file.toBuffer();
      const result = await this.minioService.uploadFile(isPublic ? 'public' : 'private', fileName, fileBuffer, file.mimetype, isPublic);
      if (this.minioConfig.domain) {
        return buildURL(this.minioConfig.domain, result)
      } else {
        return buildURL(this.minioConfig.endpoint, result, this.minioConfig.port)
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
} 