import { DatabaseConfig } from './interface/database.interface';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import { HttpConfig } from './interface/http.interface';

export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  get databaseConfig(): DatabaseConfig {
    const databaseConfig: DatabaseConfig | undefined =
      this.config.get<DatabaseConfig>('database');

    if (!databaseConfig) {
      throw new ConflictException('Database configuration is not found');
    }

    return databaseConfig;
  }

  get httpConfig(): HttpConfig {
    const httpConfig: HttpConfig | undefined =
      this.config.get<DatabaseConfig>('http');

    if (!httpConfig) {
      throw new ConflictException('Http configuration is not found');
    }

    return httpConfig;
  }
}
