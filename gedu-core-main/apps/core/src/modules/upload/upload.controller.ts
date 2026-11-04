import { BadRequestException, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ApiTags, ApiConsumes, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileValidationService } from './upload-filter.service';
import { ACCEPTED_TYPES, DEFAULT_UPLOAD_CONFIG } from './constants/upload.constants';
import { Throttle } from '@nestjs/throttler';

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
@Throttle({ default: { ttl: 3600, limit: 50 } }) // 50 uploads per hour
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileValidationService: FileValidationService
  ) {
    this.fileValidationService = new FileValidationService();
  }
  

  @Post('/:type')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'type',
    enum: ACCEPTED_TYPES.map(t => t.type),
  })
  @ApiBody({
    type: UploadFileDto,
  })
  async uploadFile(@Param('type') type: string, @Req() request: FastifyRequest) {
    const typeData = ACCEPTED_TYPES.find(t => t.type === type);
    if (!typeData) {
      throw new BadRequestException('Invalid type');
    }

    const file = await request.file();
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    this.fileValidationService.validateFile(
      file,
      typeData.mimeTypes,
      DEFAULT_UPLOAD_CONFIG.maxSizeInMB * 1024 * 1024,
    );
    
    const cdnUrl = await this.uploadService.uploadFile(
      typeData, {
        filename: file.filename,
        mimetype: file.mimetype,
        file,
      }
    );

    return cdnUrl;
  }
} 