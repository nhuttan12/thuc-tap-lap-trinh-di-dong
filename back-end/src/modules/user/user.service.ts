/**
 * @description user service
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-12
 * @modifies 2025-11-25
 * @version 1.0.3
 */

import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { UserEntityResponseDto } from './dtos/user-entity-response.dto';
import { UserMapper } from './mappers/user.mapper';
import { UserStatusCode } from './status-code/user.status-code';
import { UserStatus } from './enums/user-status.enum';
import { ImageService } from '../image/image.service';
import { ImageEntityResponse } from '../image/dtos/image-entity.response';
import { RoleService } from '../role/role.service';
import { RoleName } from '../role/enums/role-name.enum';
import { RoleResponseDto } from '../role/dtos/role-response.dto';
import { ConfigService } from '../../common/config/config.service';
import * as bcrypt from 'bcrypt';
import {UpdateUserAdminDto} from "./dtos/update-user-admin.dto";
import {CreateUserAdminDto} from "./dtos/create-user-admin.dto";
import { RoleRepository } from '../role/repositories/role.repository';

@Injectable()
export class UserService {
	private readonly logger: Logger = new Logger(UserService.name);
	private readonly salt: number;


	constructor(
		private readonly userRepository: UserRepository,
		private readonly userMapper: UserMapper,
		private readonly imageService: ImageService,
		private readonly roleService: RoleService,
		private readonly configService: ConfigService


	) {
		this.salt = this.configService.httpConfig.saltRounds;
	}

	/*
	 * @description Get user by username and password for login
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @version 1.0.0
	 */
	async getUserByUserNameAndPasswordForLogin(
		username: string,
		password: string
	): Promise<UserEntityResponseDto> {
		try {
			/*
			 * Call `getUserByUserNameAndPassword` function from repository
			 */
			const user: UserEntity | null =
				await this.userRepository.getUserByUserNameAndPassword(
					username,
					password
				);
			this.logger.debug(
				`Call \`getUserByUserNameAndPassword\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/*
			 * Check user existence
			 */
			if (!user) {
				/*
				 * If user not found, throw not found exception
				 */
				this.logger.warn(
					`User with username ${username} and password ${password} not found`
				);
				throw new NotFoundException({
					statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
					customCode: UserStatusCode.USER_NOT_FOUND.customCode,
					message: UserStatusCode.USER_NOT_FOUND.message,
				});
			}

			/*
			 * Convert user entity to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user entity to user response dto: ${JSON.stringify(userResponseDto, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUserNameAndPasswordForLogin\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/*
	 * @description Get user by user ID
	 * @author Nhut Tan
	 * @since 2025-09-10
	 * @version 1.0.0
	 */
	async getUserByUserID(userID: number): Promise<UserEntityResponseDto> {
		try {
			/*
			 * Call `getUserByUserID` function from repository
			 */
			const user: UserEntity | null =
				await this.userRepository.getUserByUerID(userID);
			this.logger.debug(
				`Call \`getUserByUserID\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/*
			 * Check user existence
			 */
			if (!user) {
				/*
				 * If user not found, throw not found exception
				 */
				this.logger.warn(`User with userID ${userID} not found`);
				throw new NotFoundException({
					statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
					customCode: UserStatusCode.USER_NOT_FOUND.customCode,
					message: UserStatusCode.USER_NOT_FOUND.message,
				});
			}

			/*
			 * Convert user entity to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user entity to user response dto: ${JSON.stringify(userResponseDto, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get user by email
	 * @param {string} email - User email
	 * @return {UserEntityResponseDto | null} - User entity response dto or null
	 * @author Nhut Tan
	 * @since 2025-09-10
	 * @version 1.0.0
	 */
	async getUserByEmail(email: string): Promise<UserEntityResponseDto | null> {
		try {
			/*
			 * Call `getUserByEmail` function from repository
			 */
			const user: UserEntity | null =
				await this.userRepository.getUserByEmail(email);
			this.logger.debug(
				`Call \`getUserByEmail\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/*
			 * Check user existence
			 */
			if (!user) {
				/*
				 * If user not exist, return null
				 */
				return null;
			}

			/*
			 * Validate status user if user banned
			 */
			if (user.status === (UserStatus.BANNED as UserStatus)) {
				throw new ForbiddenException({
					statusCode: UserStatusCode.USER_BANNED.statusCode,
					customCode: UserStatusCode.USER_BANNED.customCode,
					message: UserStatusCode.USER_BANNED.message,
				});
			}

			/*
			 * Convert user entity to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user entity to user response dto: ${JSON.stringify(userResponseDto, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByEmail\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	async createNewUserGoogle(
		email: string,
		name: string,
		imageUrl: string
	): Promise<UserEntityResponseDto> {
		try {
			/*
			 * Create new user with Google information
			 */
			const user: UserEntity =
				await this.userRepository.createNewUserGoogle(name, email);
			this.logger.debug(
				`Call \`createNewUserGoogle\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/*
			 * Call `create image` in image service
			 */
			const image: ImageEntityResponse =
				await this.imageService.createImage(imageUrl, user.id);
			this.logger.debug(
				`Call \`createImage\` function from image service: ${JSON.stringify(image, null, 2)}`
			);

			/*
			 * Convert user to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user to user response dto: ${JSON.stringify(user, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`createNewUserGoogle\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get user by `username` for checking exist
	 * @author Nhut Tan
	 * @since 2025-09-17
	 * @version 1.0.0
	 */
	async getUserByUsername(
		username: string
	): Promise<UserEntityResponseDto | null> {
		try {
			/**
			 * Call `getUserByUsername` function from repository
			 */
			const user: UserEntity | null =
				await this.userRepository.getUserByUsername(username);
			this.logger.debug(
				`Call \`getUserByUsername\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/**
			 * Check user existence
			 */
			if (!user) {
				this.logger.warn(`User with username: ${username} not exist`);
				return null;
			}

			/**
			 * Convert user entity to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user entity to user response dto: ${JSON.stringify(userResponseDto, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUserName\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Create user with username, email and password
	 * @param username
	 * @param email
	 * @param password
	 * @return {UserEntityResponseDto}
	 * @author Nhut Tan
	 * @since 2025-09-17
	 * @modifies 2025-09-23
	 * @version 1.0.1
	 */
	async createUserWithUsernameEmailPassword(
		username: string,
		email: string,
		password: string
	): Promise<UserEntityResponseDto> {
		try {
			/**
			 * Get role by name `CUSTOMER`
			 */
			const role: RoleResponseDto = await this.roleService.getRoleByName(
				RoleName.CUSTOMER
			);
			this.logger.debug(
				`Call \`getRoleByName\` function from role service: ${JSON.stringify(role, null, 2)}`
			);

			/**
			 * Get default image url
			 */
			const defaultImageUrl: string =
				'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1758105162/user-circle-isolated-icon-round-600nw-2459622791_zviocb.webp';
			const image: ImageEntityResponse =
				await this.imageService.getImageByUrl(defaultImageUrl);
			this.logger.debug(
				`Call \`getImageByUrl\` function from image service: ${JSON.stringify(image, null, 2)}`
			);

			/**
			 * Creating hashed password with salt is get from Config Service
			 */
			const hashedPassword: string = await bcrypt.hash(
				password,
				this.salt
			);
			this.logger.debug(`Hash password created: ${hashedPassword}`);

			/**
			 * Call `createUserWithUsernameEmailPassword` function from repository
			 */
			const user: UserEntity =
				await this.createUserWithUsernameEmailPasswordWithDefaultRoleAndImage(
					username,
					email,
					hashedPassword,
					role.id,
					image.id
				);
			this.logger.debug(
				`Call \`createUserWithUsernameEmailPassword\` function from repository: ${JSON.stringify(user, null, 2)}`
			);

			/**
			 * Convert user entity to user response dto
			 */
			const userResponseDto: UserEntityResponseDto =
				this.userMapper.toUserResponseDto(user);
			this.logger.debug(
				`Convert user entity to user response dto: ${JSON.stringify(userResponseDto, null, 2)}`
			);

			return userResponseDto;
		} catch (e) {
			this.logger.error(
				`Error in \`createUserWithUsernameEmailPassword\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	//////////ADMIN

	async getUsersForAdmin(
		page: number,
		limit: number,
		keyword?: string
	) {
		return this.userRepository.getUsersPagingForAdmin(
			page,
			limit,
			keyword
		);
	}

	async getUserDetailForAdmin(userId: number) {
		const user = await this.userRepository.findUserDetailForAdmin(userId);

		if (!user) {
			throw new NotFoundException({
				statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
				customCode: UserStatusCode.USER_NOT_FOUND.customCode,
				message: UserStatusCode.USER_NOT_FOUND.message,
			});
		}

		return this.userMapper.toUserResponseDto(user);
	}

	async createUserByAdmin(
		dto: CreateUserAdminDto
	): Promise<UserEntityResponseDto> {

		// 1. Check email
		if (await this.getUserByEmail(dto.email)) {
			throw new ConflictException('Email already exists');
		}

		// 2. Check username
		if (await this.getUserByUsername(dto.username)) {
			throw new ConflictException('Username already exists');
		}

		// 3. LẤY ROLE THEO NAME
		const role = await this.roleService.getRoleByName(dto.roleName);
		if (!role) {
			throw new BadRequestException(`Role ${dto.roleName} not found`);
		}

		// 4. Hash password
		const hashedPassword = await bcrypt.hash(dto.password, 10);

		// 5. Tạo user KHÔNG CÓ ẢNH - DÙNG createUserByAdmin từ repository
		const user = await this.userRepository.createUserByAdmin(
			dto.username,
			dto.email,
			hashedPassword,
			dto.fullName || dto.username,
			role.id
		);

		this.logger.debug(`User created successfully without image. ID: ${user.id}`);

		return this.getUserByUserID(user.id);
	}

	async updateUserForAdmin(
		userId: number,
		body: UpdateUserAdminDto
	) {
		const user = await this.userRepository.getUserByUerID(userId);

		if (!user) {
			throw new NotFoundException({
				statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
				customCode: UserStatusCode.USER_NOT_FOUND.customCode,
				message: UserStatusCode.USER_NOT_FOUND.message,
			});
		}

		// Cập nhật các trường mới
		if (body.fullName !== undefined) {
			user.fullName = body.fullName;
		}

		if (body.email !== undefined) {
			// Kiểm tra email trùng
			const existingUser = await this.getUserByEmail(body.email);
			if (existingUser && existingUser.id !== userId) {
				throw new ConflictException('Email already exists');
			}
			user.email = body.email;
		}

		if (body.status) {
			user.status = body.status;
		}

		if (body.roleId) {
			user.role = { id: body.roleId } as any;
		}

		user.updatedAt = new Date();

		await this.userRepository.save(user);
		return this.userMapper.toUserResponseDto(user);
	}

	async deleteUserForAdmin(userId: number): Promise<void> {
		const user = await this.userRepository.getUserByUerID(userId);

		if (!user) {
			throw new NotFoundException({
				statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
				customCode: UserStatusCode.USER_NOT_FOUND.customCode,
				message: UserStatusCode.USER_NOT_FOUND.message,
			});
		}

		// Soft delete - chỉ thay đổi status
		user.status = UserStatus.DELETED;
		await this.userRepository.save(user);
	}

	async updateUserStatus(userId: number, status: string): Promise<UserEntityResponseDto> {
        const user = await this.userRepository.getUserByUerID(userId);

        if (!user) {
            throw new NotFoundException({
                statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
                customCode: UserStatusCode.USER_NOT_FOUND.customCode,
                message: UserStatusCode.USER_NOT_FOUND.message,
            });
        }

        if (!Object.values(UserStatus).includes(status as UserStatus)) {
            throw new BadRequestException('Invalid status');
        }

        user.status = status as UserStatus;
        await this.userRepository.save(user);

        return this.userMapper.toUserResponseDto(user);
    }

	async createUserWithUsernameEmailPasswordWithDefaultRoleAndImage(
		username: string,
		email: string,
		password: string,
		roleID: number,
		imageID: number
	): Promise<UserEntity> {
		return await this.userRepository.createUserWithUsernameEmailPasswordWithDefaultRoleAndImage(
			username,
			email,
			password,
			roleID,
			imageID
		);
	}
	async updateUserEntity(entity: UserEntity): Promise<UserEntity> {
		return await this.userRepository.save(entity);
	}
	async getUserEntityById(userId: number): Promise<UserEntity | null> {
		return await this.userRepository.getUserByUerID(userId);
	}
}
