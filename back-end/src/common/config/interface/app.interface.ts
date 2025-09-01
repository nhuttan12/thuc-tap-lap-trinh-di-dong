/**
 * @description: AppConfig interface for parsed configuration and get data
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */

import { DatabaseConfig } from './database.interface';
import { HttpConfig } from './http.interface';

export interface AppConfig {
  database: DatabaseConfig;
  http: HttpConfig;
}
