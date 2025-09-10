/*
 * @description: Main module of application
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @version: 1.0.1
 * @modifies: 2025-09-01
 * @modifies: 2025-09-10
 * */

import { Logger, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './common/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { envValidationSchema } from './common/config/validation/validation.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,
    ConfigModule,
    UserModule,
    AuthModule,
    RoleModule,
  ],
  providers: [Logger, ConfigService],
  exports: [Logger, ConfigService],
})
export class AppModule {}
