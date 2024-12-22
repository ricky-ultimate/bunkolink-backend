import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLoggerService } from './common/services/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown fields
      forbidNonWhitelisted: true, // Throw error on unknown fields
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('API documentation for the Library Management System')
    .setVersion('1.0')
    .addTag('Books')
    .addTag('Students')
    .addTag('Borrowed Books')
    .addTag('Health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
