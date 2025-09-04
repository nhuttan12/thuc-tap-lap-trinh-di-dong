/*
 * @description: Configuration for TypeORM migration
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @version: 1.0.0
 * */

import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import configuration from '../configuration';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { cwd } from 'process';
import { ConfigService as NestConfigService } from '@nestjs/config';

const logger: Logger = new Logger();
const nestConfigService: NestConfigService = new NestConfigService();

logger.debug('Database configuration', configuration().database);

const devPath: string = join(cwd(), 'src', 'migration', '*.ts');
const productionPath: string = join(cwd(), 'dist', 'migration', '*.js');
const environment: string | undefined = nestConfigService.get<string>('http.environment');

const options: DataSourceOptions = {
  type: configuration().database.type as DatabaseType,
  host: configuration().database.host,
  port: configuration().database.port,
  username: configuration().database.username,
  password: configuration().database.password,
  database: configuration().database.database,
  logging: true,
  synchronize: false,
  migrations: [environment === 'production' ? productionPath : devPath],
} as DataSourceOptions;

export const AppDataSource = new DataSource(options);
