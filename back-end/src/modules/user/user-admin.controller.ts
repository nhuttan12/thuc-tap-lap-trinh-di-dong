import {
	Controller,
	Get,
	Param,
	Put,
	Query,
	Body,
	Logger,
	Post,
	ParseIntPipe,
	Delete,
	HttpCode,
	HttpStatus,
	Patch,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserAdminDto } from './dtos/update-user-admin.dto';
import { CreateUserAdminDto } from './dtos/create-user-admin.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin/users')
export class UserAdminController {
	private readonly logger = new Logger(UserAdminController.name);

	constructor(private readonly userService: UserService) {}

	@Get()
	getUsers(
		@Query('page') page = 1,
		@Query('limit') limit = 20,
		@Query('keyword') keyword?: string
	) {
		return this.userService.getUsersForAdmin(page, limit, keyword);
	}

	@Get(':id')
	getUserDetail(@Param('id', ParseIntPipe) id: number) {
		return this.userService.getUserDetailForAdmin(id);
	}

	@Post()
	createUserByAdmin(@Body() dto: CreateUserAdminDto) {
		return this.userService.createUserByAdmin(dto);
	}

	@Put(':id')
	updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateUserAdminDto
	) {
		return this.userService.updateUserForAdmin(id, body);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async deleteUser(@Param('id') id: number): Promise<{
		data: { id: number };
		message: string;
		statusCode: string;
	}> {
		await this.userService.deleteUserForAdmin(id);
		return {
			data: { id },
			message: 'Xóa người dùng thành công',
			statusCode: 'USER_ADMIN_005',
		};
	}

	// Hoặc soft delete bằng status
	@Patch(':id/status')
	@HttpCode(HttpStatus.OK)
	async updateUserStatus(
		@Param('id') id: number,
		@Body('status') status: string
	): Promise<any> {
		const user = await this.userService.updateUserStatus(id, status);
		return {
			data: user,
			message: 'Cập nhật trạng thái thành công',
			statusCode: 'USER_ADMIN_006',
		};
	}
}
