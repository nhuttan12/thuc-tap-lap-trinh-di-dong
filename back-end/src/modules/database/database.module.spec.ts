import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import { DatabaseConfig } from '../../common/config/interface/database.interface';
import { DatabaseModule, PG_CONNECTION_PROVIDER } from './database.module';
import { ConfigService } from '../../common/config/config.service';

/*
 * Mock the pg library to prevent an actual database connection
 * */
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
  };

  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('DatabaseModule', () => {
  let testingModule: TestingModule;
  let pgPool: Pool;

  /*
   * Define mock data that our config service mock will return
   * */
  const mockDatabaseConfig: DatabaseConfig = {
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'password',
    database: 'tt-mobile',
  };

  /*
   * Mock the ConfigService to return mock data
   * */
  const mockConfigService = {
    databaseConfig: mockDatabaseConfig,
  };

  beforeEach(async () => {
    /*
     * Create a testing module that imports the real DatabaseModule.
     * This allows us to test the module's setup as a whole.
     * */
    testingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    pgPool = testingModule.get<Pool>(PG_CONNECTION_PROVIDER);
  });

  afterEach(() => {
    /*
     * Clean up the mock calls after each test
     * */
    jest.clearAllMocks();
  });

  it('should be define', () => {
    expect(testingModule).toBeDefined();
  });

  it('should provide the database connection pool', () => {
    expect(pgPool).toBeInstanceOf(Pool);
  });

  /*
   * assert that the Pool constructor was called with the
   * exact credentials from our mock config.
   * */
  it('should call the pg Pool constructor with correct credentials', () => {
    const mockPgToolConstructor = Pool as jest.MockedClass<typeof Pool>;

    expect(mockPgToolConstructor).toHaveBeenCalledWith({
      user: mockDatabaseConfig.username,
      password: mockDatabaseConfig.password,
      database: mockDatabaseConfig.database,
      host: mockDatabaseConfig.host,
      port: mockDatabaseConfig.port,
    });
  });
});
