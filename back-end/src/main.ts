import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from './common/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Inject logger module to app
  app.useLogger(app.get(LoggerModule));

  // 2. Set global pipe with validation
  app.useGlobalPipes(new ValidationPipe());

  // 3. Get config service
  const configService: ConfigService = app.get(ConfigService);

  // 4. Get port from config service
  const port: number | undefined = configService.get<number>('http.port');

  // 5. Listen to port
  await app.listen(port ?? 3000);
}

bootstrap();
