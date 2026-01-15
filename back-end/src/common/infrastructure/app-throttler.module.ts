/**
 * @description Module for throttler
 * @author Nhut Tan
 * @since 2025-11-27
 * @version 1.0.0
 */

import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{
					ttl: config.throttlerConfig.ttl,
					limit: config.throttlerConfig.limit,
				},
			],
		}),
	],
})
export class AppThrottlerModule {}
