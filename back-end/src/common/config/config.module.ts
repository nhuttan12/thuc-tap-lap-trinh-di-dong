/*
 * @description: A module to retrieve the data from environment file
 * from the NestJS ConfigModule.
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @edited: 2025-09-01
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
