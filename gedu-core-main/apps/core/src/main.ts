import {
  createGrpcOptions,
  GRPC_SERVICE_CONFIG,
} from "@gedu/transport";
import multipart from "@fastify/multipart";
import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {MicroserviceOptions} from "@nestjs/microservices";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ClassValidationException} from "@gedu/http/exceptions";
import { APP_CONFIG_KEY, AppConfig, GRPC_CONFIG_KEY, GrpcConfiguration } from '@gedu/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // @ts-ignore
    new FastifyAdapter({
      logger: true,
      trustProxy: true    
    })
  );

  const appConfig = app.get<AppConfig>(APP_CONFIG_KEY);

  // Enable gRPC microservice for school service
  app.connectMicroservice<MicroserviceOptions>(
    createGrpcOptions(GRPC_SERVICE_CONFIG)
  );

  // Register multipart plugin
  // @ts-ignore
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => {
        const details = errors.flatMap((error) => {
          const { property, constraints } = error;
          if (!constraints) return [];

          return Object.values(constraints).map(
            (message) => `${property}: ${message}`
          );
        });

        return new ClassValidationException(details);
      },
    })
  );

  // app.useGlobalFilters(
  //   new ValidationExceptionFilter(),
  //   new PrismaExceptionFilter(),
  //   new AppExceptionFilter()
  // );

  // Configure static assets
  // app.useStaticAssets({
  //   root: join(__dirname, "..", "public"),
  //   prefix: "/public/",
  // });

  // Swagger documentation setup
  if (appConfig.enableSwagger) {
    const apiPath = appConfig.apiPath;
    const config = new DocumentBuilder()
      .setTitle("Edu Hub API")
      .setDescription("The Edu Hub School Management System API documentation")
      .setVersion("1.0.0")
      .addBearerAuth()
      .addServer(apiPath)
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    
    const swaggerCDN = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.18.2";
    SwaggerModule.setup("swagger", app, document, {
      customSiteTitle: "Edu Hub API",
      customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
      customJs: [
        `${swaggerCDN}/swagger-ui-bundle.js`,
        `${swaggerCDN}/swagger-ui-standalone-preset.js`
      ]
    });
  }

  // Start all microservices
  await app.startAllMicroservices();

  // Start the server
  const port = appConfig.port;
  await app.listen(port, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
