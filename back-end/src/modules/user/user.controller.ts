/**
 *
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { seed } from '../../common/database/seed/seed';
import { csvSeed } from '../../common/database/seed/csv-seed';

@Controller('user')
export class UserController {
	private readonly logger: Logger = new Logger(UserController.name);

	constructor(private readonly userService: UserService) {}

	@Get('seed')
	async seeding(): Promise<void> {
		await seed();
	}

	@Get('csv')
	async csvSeeding(): Promise<void> {
		await csvSeed();
	}
}
