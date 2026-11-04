import { Module } from '@nestjs/common';
import { ImportHttpModule } from './http/import-http.module';
import { ImportProcessModule } from './process/import-process.module';

@Module({
  imports: [
    ImportHttpModule,
    ImportProcessModule,
  ],
})
export class ImportModule { }
