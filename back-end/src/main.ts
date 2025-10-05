/**
 * @description Main file
 * @author Nhut Tan
 * @since 2025-08-29
 * @modifies 2025-09-18
 * @version 1.0.1
 */

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger, INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { CatchEverythingFilter } from './common/filter/catch-everything.filter'

async function bootstrap() {
	/**
	 * Create Nest application
	 */
	const app: INestApplication = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger('Nest', {
			logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
			colors: true,
			timestamp: true,
		}),
	})

	/*
	 * Set global pipe with validation
	 */
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		})
	)

	/*
	 * Set up global filter
	 */
	const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost)
	app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost))

	/*
	 * Get config service
	 */
	const nestConfigService: NestConfigService = app.get(NestConfigService)

	/*
	 * Get port from config service
	 */
	const port: number | undefined = nestConfigService.get<number>('HTTP_PORT')

	// Listen to port
	await app.listen(port ?? 3000)
}

bootstrap()
