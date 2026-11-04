import { Module } from "@nestjs/common";
import { ConfigModule, 
  databaseConfig, 
  grpcConfig, 
  kafkaConfig, 
  minioConfig 
} from "@gedu/config";
import { ImportModule } from './modules/import/import.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot([
      databaseConfig,
      kafkaConfig,
      minioConfig,
      grpcConfig,
    ]),
    ImportModule,
    HealthModule
  ],
})
export class AppModule {}