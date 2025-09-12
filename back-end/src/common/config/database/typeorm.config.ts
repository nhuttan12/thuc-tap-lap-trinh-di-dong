/*
 * @description: Configuration for TypeORM migration
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modified: 2025-09-12
 * @version: 1.0.1
 * */

import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { cwd } from 'process';
import { env } from 'node:process';
import { config } from 'dotenv';

/*
 * Load environment file before readding env
 * */
config({ path: '.env.local' });

const devPath: string = join(cwd(), 'src', 'migration', '*.ts');
const productionPath: string = join(cwd(), 'dist', 'migration', '*.js');
const environment: string | undefined = env.HTTP_ENVIRONMENT;

const options: DataSourceOptions = {
  type: env.DATABASE_TYPE,
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  logging: true,
  synchronize: false,
  migrations: [environment === 'production' ? productionPath : devPath],
} as DataSourceOptions;

export const AppDataSource = new DataSource(options);
