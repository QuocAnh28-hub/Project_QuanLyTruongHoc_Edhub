import { Module } from '@nestjs/common';

import { MinioModule } from '@gedu/minio';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';
import { MINIO_BUILT_IN_ARGS } from '@gedu/config';

 
@Module({
  imports: [MinioModule.registerAsync(MINIO_BUILT_IN_ARGS)],
  controllers: [StaticController],
  providers: [StaticService],
  exports: [StaticService],
})
/**  
 * StaticModule configures Minio for static file storage.  
 * Exposes StaticController and provides StaticService.  
 */ 
export class StaticModule {}