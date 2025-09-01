/*
 * @description: A service to retrieve typed application configurations.
 * This service provides a type-safe way to access configuration
 * from the NestJS ConfigModule.
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @modifies: 2025-09-01
 * @version: 1.0.0
 * */

import { DatabaseConfig } from './interface/database.interface';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { HttpConfig } from './interface/http.interface';

export class ConfigService {
  /*
   * @param config - The NestJS ConfigService injected via dependency injection.
   * */
  constructor(private readonly config: NestConfigService) {}

  /*
   * @description: Retrieve the database configuration object.
   * Throw ConflictException if the configuration is not found.
   * @returns {DatabaseConfig} The database configuration object.
   * */
  get databaseConfig(): DatabaseConfig {
    /*
     * Retrieve the database configuration object.
     * */
    const databaseConfig: DatabaseConfig | undefined =
      this.config.get<DatabaseConfig>('database');

    /*
     * Check the object exist, if not, throw Conflict exception
     * */
    if (!databaseConfig) {
      throw new ConflictException('Database configuration is not found');
    }

    /*
     * Return the object
     * */
    return databaseConfig;
  }

  /*
   * @description: Retrieve the http configuration object.
   * Throw ConflictException if the configuration is not found.
   * @returns {HttpConfig} The http configuration object.
   * */
  get httpConfig(): HttpConfig {
    /*
     * Retrieve the http configuration object.
     * */
    const httpConfig: HttpConfig | undefined =
      this.config.get<HttpConfig>('http');

    /*
     * Check the object exist, if not, throw Conflict exception
     * */
    if (!httpConfig) {
      throw new ConflictException('Http configuration is not found');
    }

    /*
     * Return the object
     * */
    return httpConfig;
  }
}
