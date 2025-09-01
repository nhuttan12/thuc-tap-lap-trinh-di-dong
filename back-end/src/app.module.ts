/*
 * @description: Main module of application
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @version: 1.0.1
 * @modifies: 2025-09-01
 * */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { LoggerModule } from './common/logger/winston.logger';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './common/config/config.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
    }),
    LoggerModule,
    DatabaseModule,
    ConfigModule,
  ],
  providers: [Logger],
})
export class AppModule {}
