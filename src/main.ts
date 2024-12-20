import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppLoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLoggerService)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown fields
      forbidNonWhitelisted: true, // Throw error on unknown fields
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Enable global exception filter
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  await app.listen(3000);
}
bootstrap();
