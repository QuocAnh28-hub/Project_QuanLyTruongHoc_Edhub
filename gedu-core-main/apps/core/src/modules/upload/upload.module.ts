import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UPLOAD_CONFIG, DEFAULT_UPLOAD_CONFIG } from './constants/upload.constants';
import { FileValidationService } from './upload-filter.service';
import { MinioModule } from '@gedu/minio';
import { MINIO_BUILT_IN_ARGS } from '@gedu/config';

@Module({
  imports: [
    MinioModule.registerAsync(MINIO_BUILT_IN_ARGS),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    FileValidationService,
    {
      provide: UPLOAD_CONFIG,
      useValue: DEFAULT_UPLOAD_CONFIG,
    },
  ],
  exports: [UploadService],
})
export class UploadModule {} 