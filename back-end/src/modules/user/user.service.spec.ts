/**
 * @description Unit Test file for testing UserService class
 * @author Nhut Tan
 * @since 2025-11-20
 * @version 1.0.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { UserMapper } from './mappers/user.mapper';
import { ImageService } from '../image/image.service';
import { RoleService } from '../role/role.service';
import { UserEntity } from './entities/user.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { UserEntityResponseDto } from './dtos/user-entity-response.dto';
import { UserStatus } from './enums/user-status.enum';
import { RoleName } from '../role/enums/role-name.enum';
import { UserImageEntity } from '../image/entities/user-image.entity';
import { UserDetailEntity } from './entities/user-detail.entity';
import { RoleEntity } from '../role/entities/role.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { WishlistItemEntity } from '../wishlist/entities/wishlist-item.entity';
import { ConfigService } from '../../common/config/config.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { ImageStatusEnum } from '../image/enums/image-status.enum';

describe('UserService', (): void => {
	let userService: UserService;

	const mockUserRepository = {
		getUserByUserNameAndPassword: jest.fn(),
		getUserByUerID: jest.fn(),
		getUserByEmail: jest.fn(),
		createNewUserGoogle: jest.fn(),
		getUserByUsername: jest.fn(),
		createUserWithUsernameEmailPassword: jest.fn(),
	};

	const mockUserMapper = {
		toUserResponseDto: jest.fn(),
	};

	const mockImageService = {
		createImage: jest.fn(),
		getImageByUrl: jest.fn(),
	};

	const mockRoleService = {
		getRoleByName: jest.fn(),
	};

	const mockConfigService = {
		httpConfig: {
			saltRounds: 12,
		},
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UserRepository,
					useValue: mockUserRepository,
				},
				{
					provide: UserMapper,
					useValue: mockUserMapper,
				},
				{
					provide: ImageService,
					useValue: mockImageService,
				},
				{
					provide: RoleService,
					useValue: mockRoleService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		userService = module.get<UserService>(UserService);
	});

	afterEach((): void => {
		jest.resetAllMocks();
	});

	describe('getUserByUserNameAndPasswordForLogin', (): void => {
		const mockUsername: string = 'mockPassword';
		const mockPassword: string = 'mockPassword';
		const mockEmail: string = 'mockEmail@gmail.com';
		const mockUserEntity: UserEntity = {
			id: 1,
			cart: [] as CartEntity[],
			status: UserStatus.ACTIVE,
			userImages: [] as UserImageEntity[],
			userDetail: {} as UserDetailEntity,
			role: { name: RoleName.CUSTOMER } as RoleEntity,
			email: mockEmail,
			username: mockUsername,
			password: mockPassword,
			fullName: 'mockFullName',
			order: [] as OrderEntity[],
			wishlistItems: [] as WishlistItemEntity[],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const mockUserResponseDto: UserEntityResponseDto = {
			id: 1,
			status: UserStatus.ACTIVE.toString(),
			role: RoleName.CUSTOMER.toString(),
			email: mockEmail,
			username: mockUsername,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		it('should return UserEntityResponseDto when getUserByUserNameAndPasswordForLogin', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByUserNameAndPassword.mockResolvedValueOnce(
				mockUserEntity
			);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(
				mockUserResponseDto
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByUserNameAndPasswordForLogin = jest.spyOn(
				userService,
				'getUserByUserNameAndPasswordForLogin'
			);

			/**
			 * Call function
			 */
			const result: UserEntityResponseDto =
				await userService.getUserByUserNameAndPasswordForLogin(
					mockUsername,
					mockPassword
				);

			/**
			 * Assert equal
			 */
			expect(result).toEqual(mockUserResponseDto);

			/**
			 * Assert call time
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledTimes(1);
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert call with
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledWith(
				mockUserEntity
			);
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByUserNameAndPassword\` function from repository: ${JSON.stringify(mockUserEntity)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Convert user entity to user response dto: ${JSON.stringify(mockUserResponseDto)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});

		it('should throw NotFoundException when user not found', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByUserNameAndPassword.mockResolvedValueOnce(
				null
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByUserNameAndPasswordForLogin = jest.spyOn(
				userService,
				'getUserByUserNameAndPasswordForLogin'
			);

			/**
			 * Call function and assert equal
			 */
			await expect(
				userService.getUserByUserNameAndPasswordForLogin(
					mockUsername,
					mockPassword
				)
			).rejects.toThrow(NotFoundException);

			/**
			 * Assert call time
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).not.toHaveBeenCalled();
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);

			/**
			 * Assert call with
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByUserNameAndPassword\` function from repository: ${null}`
			);
			expect(spyLoggerWarn).toHaveBeenCalledWith(
				`User with username ${mockUsername} and password ${mockPassword} not found`
			);
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining(
					'Error in `getUserByUserNameAndPasswordForLogin`: User not found'
				),
				expect.any(String)
			);
		});

		it('should throw Internal Server Error when no connection found from database', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByUserNameAndPassword.mockRejectedValueOnce(
				new Error('Database connection lost')
			);

			/**
			 * Spy function called
			 */
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyGetUserByUserNameAndPasswordForLogin = jest.spyOn(
				userService,
				'getUserByUserNameAndPasswordForLogin'
			);

			/**
			 * Assert to throw
			 */
			await expect(
				userService.getUserByUserNameAndPasswordForLogin(
					mockUsername,
					mockPassword
				)
			).rejects.toThrow(Error);

			/**
			 * Assert call with
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining(
					'Error in `getUserByUserNameAndPasswordForLogin`'
				),
				expect.any(String)
			);

			/**
			 * Assert call time
			 */
			expect(
				mockUserRepository.getUserByUserNameAndPassword
			).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).not.toHaveBeenCalled();
			expect(
				spyGetUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
		});
	});

	describe('getUserByUserID', (): void => {
		const mockUserID: number = 1;
		const mockUsername: string = 'mockPassword';
		const mockPassword: string = 'mockPassword';
		const mockEmail: string = 'mockEmail@gmail.com';
		const mockUserEntity: UserEntity = {
			id: mockUserID,
			cart: [] as CartEntity[],
			status: UserStatus.ACTIVE,
			userImages: [] as UserImageEntity[],
			userDetail: {} as UserDetailEntity,
			role: { name: RoleName.CUSTOMER } as RoleEntity,
			email: mockEmail,
			username: mockUsername,
			password: mockPassword,
			fullName: 'mockFullName',
			order: [] as OrderEntity[],
			wishlistItems: [] as WishlistItemEntity[],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const mockUserResponseDto: UserEntityResponseDto = {
			id: mockUserID,
			status: UserStatus.ACTIVE.toString(),
			role: RoleName.CUSTOMER.toString(),
			email: mockEmail,
			username: mockUsername,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		it('should return UserEntityResponseDto when getUserByUserID', async (): Promise<void> => {
			/**
			 * Mock data resolve and return
			 */
			mockUserRepository.getUserByUerID.mockResolvedValueOnce(
				mockUserEntity
			);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(
				mockUserResponseDto
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByUserID = jest.spyOn(
				userService,
				'getUserByUserID'
			);

			/**
			 * Assert equal
			 */
			const result: UserEntityResponseDto =
				await userService.getUserByUserID(mockUserID);
			expect(result).toEqual(mockUserResponseDto);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledTimes(1);
			expect(spyGetUserByUserID).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledWith(
				mockUserID
			);
			expect(spyGetUserByUserID).toHaveBeenCalledWith(mockUserID);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByUserID\` function from repository: ${JSON.stringify(mockUserEntity)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Convert user entity to user response dto: ${JSON.stringify(mockUserResponseDto)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});

		it('should throw NotFoundException when user not found', async (): Promise<void> => {
			/**
			 * Mock data resolve and return
			 */
			mockUserRepository.getUserByUerID.mockResolvedValueOnce(null);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(undefined);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByUserID = jest.spyOn(
				userService,
				'getUserByUserID'
			);

			/**
			 * Assert equal
			 */
			await expect(
				userService.getUserByUserID(mockUserID)
			).rejects.toThrow(NotFoundException);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).not.toHaveBeenCalled();
			expect(spyGetUserByUserID).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledWith(
				mockUserID
			);
			expect(spyGetUserByUserID).toHaveBeenCalledWith(mockUserID);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByUserID\` function from repository: ${null}`
			);
			expect(spyLoggerDebug).not.toHaveBeenNthCalledWith(
				2,
				`Convert user entity to user response dto: ${undefined}`
			);
			expect(spyLoggerWarn).toHaveBeenCalledWith(
				`User with userID ${mockUserID} not found`
			);
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining(
					'Error in `getUserByUserID`: User not found'
				),
				expect.any(String)
			);
		});

		it('should throw Internal Server Error when no connection found from database', async (): Promise<void> => {
			/**
			 * Mock data resolve and return
			 */
			mockUserRepository.getUserByUerID.mockRejectedValueOnce(
				new Error('Database connection lost')
			);

			/**
			 * Spy function called
			 */
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyGetUserByUserID = jest.spyOn(
				userService,
				'getUserByUserID'
			);

			/**
			 * Assert to throw
			 */
			await expect(
				userService.getUserByUserID(mockUserID)
			).rejects.toThrow(Error);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledWith(
				mockUserID
			);
			expect(spyGetUserByUserID).toHaveBeenCalledWith(mockUserID);
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining('Error in `getUserByUserID`'),
				expect.any(String)
			);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByUerID).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).not.toHaveBeenCalled();
			expect(spyGetUserByUserID).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
		});
	});

	describe('getUserByEmail', (): void => {
		const mockEmail: string = 'mockEmail@gmail.com';
		const mockUserEntity: UserEntity = {
			id: 1,
			cart: [] as CartEntity[],
			status: UserStatus.ACTIVE,
			userImages: [] as UserImageEntity[],
			userDetail: {} as UserDetailEntity,
			role: { name: RoleName.CUSTOMER } as RoleEntity,
			email: mockEmail,
			username: 'mockUsername',
			password: 'mockPassword',
			fullName: 'mockFullName',
			order: [] as OrderEntity[],
			wishlistItems: [] as WishlistItemEntity[],
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		const mockUserResponseDto: UserEntityResponseDto = {
			id: 1,
			status: UserStatus.ACTIVE.toString(),
			role: RoleName.CUSTOMER.toString(),
			email: mockEmail,
			username: 'mockUsername',
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};
		const bannedUser: UserEntity = {
			...mockUserEntity,
			status: UserStatus.BANNED,
		};

		it('should return UserEntityResponseDto get user by email', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByEmail.mockResolvedValueOnce(
				mockUserEntity
			);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(
				mockUserResponseDto
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByEmail = jest.spyOn(userService, 'getUserByEmail');

			/**
			 * Assert equal
			 */
			const result: UserEntityResponseDto | null =
				await userService.getUserByEmail(mockEmail);
			expect(result).toEqual(mockUserResponseDto);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledTimes(1);
			expect(spyGetUserByEmail).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
				mockEmail
			);
			expect(spyGetUserByEmail).toHaveBeenCalledWith(mockEmail);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByEmail\` function from repository: ${JSON.stringify(mockUserEntity)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Convert user entity to user response dto: ${JSON.stringify(mockUserResponseDto)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});

		it('should return null if user not exist', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByEmail.mockResolvedValueOnce(null);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(undefined);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByEmail = jest.spyOn(userService, 'getUserByEmail');

			/**
			 * Assert equal
			 */
			const result: UserEntityResponseDto | null =
				await userService.getUserByEmail(mockEmail);
			expect(result).toEqual(null);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).not.toHaveBeenCalled();
			expect(spyGetUserByEmail).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
				mockEmail
			);
			expect(spyGetUserByEmail).toHaveBeenCalledWith(mockEmail);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByEmail\` function from repository: ${null}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});

		it('should throw ForbiddenException if user have banned status', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.getUserByEmail.mockResolvedValueOnce(bannedUser);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(undefined);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyGetUserByEmail = jest.spyOn(userService, 'getUserByEmail');

			/**
			 * Assert equal
			 */
			await expect(userService.getUserByEmail(mockEmail)).rejects.toThrow(
				ForbiddenException
			);

			/**
			 * Assert call time
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledTimes(0);
			expect(spyGetUserByEmail).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);

			/**
			 * Assert call with
			 */
			expect(mockUserRepository.getUserByEmail).toHaveBeenCalledWith(
				mockEmail
			);
			expect(spyGetUserByEmail).toHaveBeenCalledWith(mockEmail);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getUserByEmail\` function from repository: ${JSON.stringify(bannedUser)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining('Error in `getUserByEmail`'),
				expect.any(String)
			);
		});
	});

	describe('createNewUserGoogle', (): void => {
		const mockEmail: string = 'mockEmail@gmail.com';
		const mockUsername: string = 'mockUsername';
		const mockPassword: string = 'mockPassword';
		const mockFullName: string = 'mockFullName';
		const mockImageUrl: string = 'http://sample_image.com';
		const mockCurrentDate: Date = new Date();
		const mockUserEntity: UserEntity = {
			id: 1,
			cart: [] as CartEntity[],
			status: UserStatus.ACTIVE,
			userImages: [] as UserImageEntity[],
			userDetail: {} as UserDetailEntity,
			role: { name: RoleName.CUSTOMER } as RoleEntity,
			email: mockEmail,
			username: mockUsername,
			password: mockPassword,
			fullName: mockFullName,
			order: [] as OrderEntity[],
			wishlistItems: [] as WishlistItemEntity[],
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};
		const mockUserResponseDto: UserEntityResponseDto = {
			id: 1,
			status: UserStatus.ACTIVE.toString(),
			role: RoleName.CUSTOMER.toString(),
			email: mockEmail,
			username: mockUsername,
			createdAt: mockCurrentDate.toString(),
			updatedAt: mockCurrentDate.toString(),
		};
		const mockImageEntity: ImageEntity = {
			id: 1,
			url: mockImageUrl,
			productImage: {} as ProductImageEntity,
			userImage: {} as UserImageEntity,
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};

		it('should return UserEntityResponse when create new user google', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockUserRepository.createNewUserGoogle.mockResolvedValueOnce(
				mockUserEntity
			);
			mockImageService.createImage.mockResolvedValueOnce(mockImageEntity);
			mockUserMapper.toUserResponseDto.mockReturnValueOnce(
				mockUserResponseDto
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(userService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(userService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(userService['logger'], 'error')
				.mockImplementation();
			const spyCreateNewUserGoogle = jest.spyOn(
				userService,
				'createNewUserGoogle'
			);

			/**
			 * Assert equal
			 */
			const result: UserEntityResponseDto =
				await userService.createNewUserGoogle(
					mockEmail,
					mockFullName,
					mockImageUrl
				);
			await expect(result).resolves.toEqual(mockUserResponseDto);

			/**
			 * Assert calld time
			 */
			expect(mockImageService.createImage).toHaveBeenCalledTimes(1);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledTimes(1);
			expect(spyCreateNewUserGoogle).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(3);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert called with
			 */
			expect(mockImageService.createImage).toHaveBeenCalledWith(
				mockImageUrl
			);
			expect(mockUserMapper.toUserResponseDto).toHaveBeenCalledWith(
				mockUserResponseDto
			);
			expect(spyCreateNewUserGoogle).toHaveBeenCalledWith(
				mockEmail,
				mockFullName,
				mockImageUrl
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`createNewUserGoogle\` function from repository: ${JSON.stringify(mockUserEntity)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Call \`createImage\` function from image service: ${JSON.stringify(mockImageEntity)}`
			);

			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				3,
				`Convert user to user response dto: ${JSON.stringify(mockUserEntity)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});
	});
});
