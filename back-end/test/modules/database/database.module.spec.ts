/*
 * @description: Mocking test create typeorm options
 * @author: Nhut Tan
 * @date: 2025-09-01
 * @version: 1.0.0
 * */

import { DatabaseConfig } from '../../../src/common/config/interface/database.interface';
import { DatabaseType } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../../../src/common/config/config.service';
import { createTypeOrmModuleOptions } from '../../../src/modules/database/database.module';

describe('create typeorm config options', (): void => {
  /*
   * Define mock data that our config service mock will return
   * */
  const mockDatabaseConfig: DatabaseConfig = {
    type: 'postgres' as DatabaseType,
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123123',
    database: 'tt-mobile',
  };

  /*
   * Mock the ConfigService to return mock data
   * */
  const mockConfigService: Partial<ConfigService> = {
    databaseConfig: mockDatabaseConfig,
  };

  it('should return correct TypeORM config', (): void => {
    const options: TypeOrmModuleOptions = createTypeOrmModuleOptions(
      mockConfigService as ConfigService,
    );

    expect(options).toMatchObject({
      ...mockDatabaseConfig,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['src/migration/*.ts'],
    });
  });
});
