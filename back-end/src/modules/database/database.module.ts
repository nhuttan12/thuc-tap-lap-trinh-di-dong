import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseConfig } from '../../common/config/interface/database.interface';
import { ConfigService } from '../../common/config/config.service';
import { ConfigModule } from '../../common/config/config.module';

export const PG_CONNECTION_PROVIDER = 'PG_CONNECTION';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_CONNECTION_PROVIDER,
      useFactory: (configService: ConfigService): Pool => {
        const databaseConfig: DatabaseConfig = configService.databaseConfig;
        return new Pool({
          user: databaseConfig.username,
          password: databaseConfig.password,
          database: databaseConfig.database,
          host: databaseConfig.host,
          port: databaseConfig.port,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PG_CONNECTION_PROVIDER],
})
export class DatabaseModule {}
