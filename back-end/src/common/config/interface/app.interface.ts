import { DatabaseConfig } from './database.interface';
import { HttpConfig } from './http.interface';

/**
 * @description: AppConfig interface for parsed configuration and get data
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */
export interface AppConfig {
  database: DatabaseConfig;
  http: HttpConfig;
}
