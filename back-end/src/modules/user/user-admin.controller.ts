import {
    Controller,
    Get,
    Param,
    Put,
    Query,
    Body,
    Logger, Post, ParseIntPipe,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserAdminDto } from './dtos/update-user-admin.dto';
import {CreateUserAdminDto} from "./dtos/create-user-admin.dto";

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

}
