import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set global pipe with validation
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const port: number | undefined = configService.get<number>('http.port');

  await app.listen(port ?? 3000);
}

bootstrap();
