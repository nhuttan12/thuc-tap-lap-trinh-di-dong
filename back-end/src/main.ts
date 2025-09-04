import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('Nest', {
      logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
      colors: true,
      timestamp: true,
    }),
  });

  /*
   * 2. Set global pipe with validation
   * */
  app.useGlobalPipes(new ValidationPipe());

  /*
   * 3. Get config service
   * */
  const nestConfigService: NestConfigService = app.get(NestConfigService);

  /*
   * 4. Get port from config service
   * */
  const port: number | undefined = nestConfigService.get<number>('http.port');

  // 5. Listen to port
  await app.listen(port ?? 3000);
}

bootstrap();
