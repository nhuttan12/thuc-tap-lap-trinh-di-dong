/*
 * @description: Main module of application
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @version: 1.0.1
 * @modifies: 2025-09-01
 * @modifies: 2025-09-08
 * */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from './common/config/config.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    ConfigModule,
    UserModule,
    AuthModule,
    RoleModule,
  ],
  providers: [
    Logger,
  ],
})
export class AppModule {}
