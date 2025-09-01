/*
 * @description: Test file for ConfigModule class to retrieve the configuration from environment variables.
 * @author: Nhut Tan
 * @date: 2025-09-01
 * @version: 1.0.0
 * @modifies: 2025-09-01
 * */

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config.module';
import { ConfigService } from '../config.service';

describe('ConfigModule', (): void => {
  /*
   * Create testing module for ConfigModule
   * */
  let testingModule: TestingModule;

  /*
   * Initial testing module before each test
   * */
  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();
  });

  /*
   * The module should be defined
   * */
  it('should compile module', (): void => {
    expect(testingModule).toBeDefined();
  });

  /*
   * Config service can be provided
   * */
  it('should provide ConfigService', (): void => {
    const configSerivce: ConfigService =
      testingModule.get<ConfigService>(ConfigService);
    expect(configSerivce).toBeInstanceOf(ConfigService);
  });

  /**
   * Config service can be exported for other module
   */
  it('should export ConfigService for other module', async () => {
    const anotherModule = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    const configService: ConfigService =
      anotherModule.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
  });
});
