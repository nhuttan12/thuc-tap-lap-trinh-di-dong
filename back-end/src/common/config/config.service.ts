/*
 * @description: A service to retrieve typed application configurations.
 * This service provides a type-safe way to access configuration
 * from the NestJS ConfigModule.
 * @author: Nhut Tan
 * @date: 2025-08-30
 * @modifies: 2025-09-10
 * @version: 1.0.1
 * */

import { DatabaseConfig } from './interface/database.interface';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { HttpConfig } from './interface/http.interface';
import { GoogleConfig } from './interface/googleConfig';

@Injectable()
export class ConfigService {
  private readonly logger: Logger = new Logger(ConfigService.name);

  /*
   * @param config - The NestJS ConfigService injected via dependency injection.
   * */
  constructor(private readonly config: NestConfigService) {}

  /*
   * @description: Retrieve database configuration object.
   * Throw ConflictException if the configuration is not found.
   * @returns {DatabaseConfig} The database configuration object.
   * */
  get databaseConfig(): DatabaseConfig {
    /*
     * Retrieve the database configuration object.
     * */
    const databaseConfig: DatabaseConfig = {
      type: this.config.get<string>('DATABASE_TYPE')!,
      host: this.config.get<string>('DATABASE_HOST')!,
      port: Number(this.config.get<number>('DATABASE_PORT')),
      username: this.config.get<string>('DATABASE_USERNAME')!,
      password: this.config.get<string>('DATABASE_PASSWORD')!,
      database: this.config.get<string>('DATABASE_NAME')!,
    };
    this.logger.debug(`Database config: ${JSON.stringify(databaseConfig)}`);

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
   * @description: Retrieve http configuration object.
   * Throw ConflictException if the configuration is not found.
   * @returns {HttpConfig} The http configuration object.
   * */
  get httpConfig(): HttpConfig {
    /*
     * Retrieve the http configuration object.
     * */
    const httpConfig: HttpConfig | undefined = {
      port: Number(this.config.get<number>('HTTP_PORT')),
      environment: this.config.get<string>('HTTP_ENVIRONMENT')!,
      jwtSecret: this.config.get<string>('HTTP_JWT_SECRET')!,
      expireTime: this.config.get<string>('HTTP_EXPIRE_TIME')!,
    };
    this.logger.debug(`Http config: ${JSON.stringify(httpConfig)}`);

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

  /*
   * @description: Retrieve google configuration object.
   * Throw ConflictException if the configuration is not found.
   * @returns {GoogleConfig} The http configuration object.
   * */
  get googleConfig(): GoogleConfig {
    /*
     * Retrieve google configuration object.
     * */
    const googleConfig: GoogleConfig | undefined = {
      clientID: this.config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: this.config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: this.config.get<string>('GOOGLE_CALLBACK_URL')!,
      accessType: this.config.get<string>('GOOGLE_ACCESS_TYPE')!,
    };
    this.logger.debug(`Http config: ${JSON.stringify(googleConfig)}`);

    /*
     * Check the object exist, if not, throw Conflict exception
     * */
    if (!googleConfig) {
      throw new ConflictException('Http configuration is not found');
    }

    /*
     * Return the object
     * */
    return googleConfig;
  }
}
