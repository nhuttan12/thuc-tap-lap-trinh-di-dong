import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigService } from '../config.service';
import { DatabaseConfig } from '../interface/database.interface';
import { HttpConfig } from '../interface/http.interface';
import { ConflictException } from '@nestjs/common';

/*
 * @description: Test file for ConfigService class to retrieve the database configuration from environment variables.
 * @author: Nhut Tan
 * @date: 2025-08-31
 * @version: 1.0.0
 * */
describe('ConfigService', () => {
  let configService: ConfigService;
  let mockNestConfigService: Partial<NestConfigService>;

  beforeEach(() => {
    mockNestConfigService = {
      get: jest.fn(),
    };

    configService = new ConfigService(
      mockNestConfigService as NestConfigService,
    );
  });

  it('should return database configuration', () => {
    /*
     * Define the mock database config
     * */
    const mockDatabaseConfig: DatabaseConfig = {
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'password',
      database: 'tt-mobile',
    };

    /*
     * Set up get method to return expected data when called with database key
     * */
    (mockNestConfigService.get as jest.Mock).mockReturnValueOnce(
      mockDatabaseConfig,
    );

    /*
     * Call getter and setter result
     * */
    const result: DatabaseConfig = configService.databaseConfig;

    /*
     * Assert the data match the mock data
     * */
    expect(result).toEqual(mockDatabaseConfig);

    /*
     * Assert that the mock 'get' method was called with the correct key.
     * */
    expect(mockNestConfigService.get).toHaveBeenCalledWith('database');
  });

  it('should return the http configuration', () => {
    /*
     * Define mock http configuration
     * */
    const mockHttpConfig: HttpConfig = {
      environment: 'develop',
      port: 8080,
    };

    /*
     * Set up get method to return expected data when called with http key
     * */
    (mockNestConfigService.get as jest.Mock).mockReturnValueOnce(
      mockHttpConfig,
    );

    /*
     * Call getter and setter result
     * */
    const result: HttpConfig = configService.httpConfig;

    /*
     * Assert the data match the mock data
     * */
    expect(result).toEqual(mockHttpConfig);

    /*
     * Assert that the mock 'get' method was called with the correct key.
     * */
    expect(mockNestConfigService.get).toHaveBeenCalledWith('http');
  });

  it('should throw ConflictException when database not found', () => {
    /*
     * Set up get method to return undefined
     */
    (mockNestConfigService.get as jest.Mock).mockReturnValueOnce(undefined);

    /*
     * Throw ConflictException when database key not found
     * */
    expect((): DatabaseConfig => configService.databaseConfig).toThrow(
      ConflictException,
    );
    expect((): DatabaseConfig => configService.databaseConfig).toThrow(
      'Database configuration is not found',
    );
  });

  it('should throw ConflictException when http key not found', () => {
    /*
     * Set up method to return undefined
     * */
    (mockNestConfigService.get as jest.Mock).mockReturnValueOnce(undefined);

    /*
     * Throw ConflictException when http key not found
     * */
    expect((): HttpConfig => configService.httpConfig).toThrow(
      ConflictException,
    );
    expect((): HttpConfig => configService.httpConfig).toThrow(
      'Http configuration is not found',
    );
  });
});
