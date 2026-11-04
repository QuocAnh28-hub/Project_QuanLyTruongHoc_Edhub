import { BadRequestException, Injectable } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';

@Injectable()
export class FileValidationService {
  validateFile(
    file: MultipartFile,
    allowedMimeTypes: string[],
    maxSizeInBytes: number,
  ) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }
    if ((file.file as any).size > maxSizeInBytes) {
      throw new BadRequestException('File is too large');
    }
  }
}
