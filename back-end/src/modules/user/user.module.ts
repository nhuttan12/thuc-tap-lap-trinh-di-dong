/*
 * @description user module
 * @author Nhut Tan
 * @since 2025-09-03
 * @modifies 2025-09-14
 * @version 1.0.2
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserMapper } from './mappers/user.mapper';
import { ImageModule } from '../image/image.module';
import { UserDetailEntity } from './entities/user-detail.entity';
import { UserController } from './user.controller';
import { RoleModule } from '../role/role.module';
import { ConfigModule } from '../../common/config/config.module';
import { UserAuthenticationEntity } from './entities/user-authentication.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			UserDetailEntity,
			UserAuthenticationEntity,
		]),
		forwardRef((): typeof ImageModule => ImageModule),
		RoleModule,
		ConfigModule,
	],
	providers: [UserRepository, UserService, UserMapper],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
