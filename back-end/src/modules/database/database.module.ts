/**
 * @description: Database module configuration for establish connection to database
 * @author: Nhut Tan
 * @date: 2025-09-01
 * @version: 1.0.0
 * @modifies: 2025-09-01
 */

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '../../common/config/config.service';
import { ConfigModule } from '../../common/config/config.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../common/config/interface/database.interface';
import { DatabaseType } from 'typeorm';

/**
 * @description: Create TypeORM module options
 * @param {ConfigService} configService
 * @returns {TypeOrmModuleOptions} TypeORM module options
 */
export function createTypeOrmModuleOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const databaseConfig: DatabaseConfig = configService.databaseConfig;

  return {
    type: databaseConfig.type as DatabaseType,
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    autoLoadEntities: true,
    synchronize: false,
  } as TypeOrmModuleOptions;
}

/**
 * @description: TypeORM configuration for database module
 */
const typeOrmConfiguration: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: createTypeOrmModuleOptions,
});

@Module({
  imports: [ConfigModule, typeOrmConfiguration],
})
export class DatabaseModule {}
