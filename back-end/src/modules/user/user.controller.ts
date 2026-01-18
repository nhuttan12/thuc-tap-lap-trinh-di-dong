/**
 *
 */

import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Patch,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { seed } from '../../common/database/seed/seed';
import { csvSeed } from '../../common/database/seed/csv-seed';
import { ImageService } from '../image/image.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { JwtPayload } from '../auth/interface/jwt-payload.interface';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AvatarStorage } from '../../common/config/cloudinany/cloudinary.storage';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
	private readonly logger: Logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly imageService: ImageService
	) {}

	@Get('seed')
	async seeding(): Promise<void> {
		await seed();
	}

	@Get('csv')
	async csvSeeding(): Promise<void> {
		await csvSeed();
	}

	@UseGuards(JwtAuthGuard)
	@Get('info')
	getProfile(@User() user: JwtPayload) {
		return this.userService.getProfile(user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('profile')
	updateProfile(@User() user: JwtPayload, @Body() dto: UpdateUserProfileDto) {
		return this.userService.updateUserProfile(user.id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Post('change-password')
	async changePassword(
		@User() user: JwtPayload,
		@Body() dto: ChangePasswordDto
	) {
		return this.userService.changePassword(user.id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Post('avatar')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: AvatarStorage,
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
		})
	)
	async uploadAvatar(
		@User() user: JwtPayload,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!file) {
			throw new BadRequestException('File không tồn tại');
		}

		const imageUrl = file.path;

		return this.imageService.createImage(imageUrl, user.id);
	}
}
