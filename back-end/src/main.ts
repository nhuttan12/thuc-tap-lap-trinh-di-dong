/*
 * @description: Main file
 * @author: Nhut Tan
 * @date: 2025-08-29
 * @version: 1.0.0
 * */

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { CatchEverythingFilter } from './common/filter/catch-everything.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('Nest', {
      logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
      colors: true,
      timestamp: true,
    }),
  });

  /*
   * Set global pipe with validation
   * */
  app.useGlobalPipes(new ValidationPipe());

  /*
   * Set up global filter
   * */
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  /*
   * Get config service
   * */
  const nestConfigService: NestConfigService = app.get(NestConfigService);

  /*
   * Get port from config service
   * */
  const port: number | undefined = nestConfigService.get<number>('http.port');

  // Listen to port
  await app.listen(port ?? 3000);
}

bootstrap();
