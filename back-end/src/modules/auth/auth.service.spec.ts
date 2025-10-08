/**
 * @description Unit Test file for testing Auth Service class
 * @author Nhut Tan
 * @since 2025-10-05
 * @version 1.0.0
 */

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthMapper } from './mapper/auth.mapper';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { RoleName } from '../role/enums/role-name.enum';
import { UserStatus } from '../user/enums/user-status.enum';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Logger,
} from '@nestjs/common';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserStatusCode } from '../user/status-code/user.status-code';
import { AuthStatusCode } from './status-code/auth.status-code';

describe('AuthService', (): void => {
	let authService: AuthService;
	let userService: jest.Mocked<UserService>;
	let jwtService: jest.Mocked<JwtService>;
	let authMapper: jest.Mocked<AuthMapper>;

	/**
	 * @description Create mocking UserService
	 */
	const mockUserService = {
		getUserByUserNameAndPasswordForLogin: jest.fn(),
		getUserByEmail: jest.fn(),
		getUserByUsername: jest.fn(),
		createUserWithUsernameEmailPassword: jest.fn(),
		createNewUserGoogle: jest.fn(),
	};

	/**
	 * @description Create mocking JwtService
	 */
	const mockJwtService = {
		sign: jest.fn(),
	};

	/**
	 * @description Create mocking AuthMapper
	 */
	const mockAuthMapper = {
		toJwtPayload: jest.fn(),
	};

	/**
	 * @description Setup NestJS testing module and inject mocked services.
	 */
	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: mockUserService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: AuthMapper,
					useValue: mockAuthMapper,
				},
			],
		}).compile();

		authService = module.get<AuthService>(
			AuthService
		) as jest.Mocked<AuthService>;
		userService = module.get<UserService>(
			UserService
		) as jest.Mocked<UserService>;
		jwtService = module.get<JwtService>(
			JwtService
		) as jest.Mocked<JwtService>;
		authMapper = module.get<AuthMapper>(
			AuthMapper
		) as jest.Mocked<AuthMapper>;

		jest.clearAllMocks();
	});

	/**
	 * @description Test userLogin function
	 */
	describe('userLogin', (): void => {
		const user: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.ACTIVE,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		const bannedUser: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.BANNED,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		const payload: JwtPayload = {
			id: 1,
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			accessToken: 'mock-token',
		};

		const mockUsername: string = 'nhuttan';
		const mockPassword: string = '123123';

		/**
		 * @description Test userLogin function when user is valid
		 */
		it('should return JwtPayload when user is valid', async (): Promise<void> => {
			userService.getUserByUserNameAndPasswordForLogin.mockResolvedValue(
				user
			);

			authMapper.toJwtPayload.mockReturnValue(payload);

			jwtService.sign.mockReturnValue(payload.accessToken);

			const result: JwtPayload = await authService.userLogin(
				mockUsername,
				mockPassword
			);

			expect(
				userService.getUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledTimes(1);
			expect(
				userService.getUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledWith(mockUsername, mockPassword);

			expect(authMapper.toJwtPayload).toHaveBeenCalledTimes(1);
			expect(authMapper.toJwtPayload).toHaveBeenCalledWith(user);

			expect(jwtService.sign).toHaveBeenCalledTimes(1);
			expect(jwtService.sign).toHaveBeenCalledWith(payload);

			expect(result).toEqual(payload);
		});

		/**
		 * @description Test userLogin function when user is banned
		 */
		it('should throw ForbiddenException when user is banned', async () => {
			userService.getUserByUserNameAndPasswordForLogin.mockResolvedValue(
				bannedUser
			);

			await expect(
				authService.userLogin(mockUsername, mockPassword)
			).rejects.toThrow(ForbiddenException);
			await expect(
				authService.userLogin(mockUsername, mockPassword)
			).rejects.toMatchObject({
				response: {
					statusCode: UserStatusCode.USER_BANNED.statusCode,
					customCode: UserStatusCode.USER_BANNED.customCode,
					message: UserStatusCode.USER_BANNED.message,
				},
			});
		});

		/**
		 * @description Test userLogin function when UserService throws error
		 */
		it('should throw error when UserService throws error', async () => {
			const error = new Error('DB Connection failed');
			userService.getUserByUserNameAndPasswordForLogin.mockRejectedValue(
				error
			);

			const result: Promise<JwtPayload> = authService.userLogin(
				mockUsername,
				mockPassword
			);

			await expect(result).rejects.toThrow('DB Connection failed');
		});

		/**
		 * @description Test userLogin function when call userService, authMapper, and jwtService with correct args
		 */
		it('should call userService, authMapper, and jwtService with correct args', async (): Promise<void> => {
			const loggerSpy = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation();

			userService.getUserByUserNameAndPasswordForLogin.mockResolvedValue(
				user
			);
			authMapper.toJwtPayload.mockReturnValue(payload);
			jwtService.sign.mockReturnValue(payload.accessToken);

			await authService.userLogin(mockUsername, mockPassword);

			expect(
				userService.getUserByUserNameAndPasswordForLogin
			).toHaveBeenCalledWith(mockUsername, mockPassword);
			expect(authMapper.toJwtPayload).toHaveBeenCalledWith(user);
			expect(jwtService.sign).toHaveBeenCalledWith(payload);
			expect(loggerSpy).toHaveBeenCalledTimes(3);
		});
	});

	/**
	 * @description Test signUp function
	 */
	describe('signUp', (): void => {
		const mockUsername: string = 'nhuttan';
		const mockEmail: string = 'nhuttan@gmail.com';
		const mockPassword: string = '123123';
		const mockRetypePassword: string = '123123';
		const user: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.ACTIVE,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		/**
		 * @description Test signUp function when user info is valid
		 */
		it('should return UserEntityResponseDto when user info is valid', async (): Promise<void> => {
			userService.getUserByEmail.mockResolvedValue(null);
			userService.getUserByUsername.mockResolvedValue(null);
			userService.createUserWithUsernameEmailPassword.mockResolvedValue(
				user
			);

			const result: UserEntityResponseDto = await authService.signUp(
				mockUsername,
				mockEmail,
				mockPassword,
				mockRetypePassword
			);

			expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
			expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

			expect(
				userService.createUserWithUsernameEmailPassword
			).toHaveBeenCalledTimes(1);
			expect(
				userService.createUserWithUsernameEmailPassword
			).toHaveBeenCalledWith(mockUsername, mockEmail, mockPassword);

			expect(result).toEqual(user);
		});

		/**
		 * @description Test signUp function when password and retypePassword not same
		 */
		it('should throw BadRequestException when password and retypePassword not same', async (): Promise<void> => {
			const loggerSpy = jest
				.spyOn(Logger.prototype, 'warn')
				.mockImplementation();

			const promise: Promise<UserEntityResponseDto> = authService.signUp(
				mockUsername,
				mockEmail,
				mockPassword,
				'123456'
			);

			await expect(promise).rejects.toThrow(BadRequestException);
			await expect(promise).rejects.toMatchObject({
				response: {
					statusCode:
						AuthStatusCode
							.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
							.statusCode,
					customCode:
						AuthStatusCode
							.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
							.customCode,
					message:
						AuthStatusCode
							.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
							.message,
				},
			});

			expect(loggerSpy).toHaveBeenCalledTimes(1);
			expect(loggerSpy).toHaveBeenCalledWith(
				'Password and retypePassword are not the same'
			);
		});

		/**
		 * @description Test signUp function when email already exist
		 */
		it('should throw ConflictException when email already exist', async (): Promise<void> => {
			const loggerWarnSpy = jest
				.spyOn(Logger.prototype, 'warn')
				.mockImplementation();
			const loggerDebugSpy = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation();

			userService.getUserByEmail.mockResolvedValue(user);

			const promise: Promise<UserEntityResponseDto> = authService.signUp(
				mockUsername,
				mockEmail,
				mockPassword,
				mockRetypePassword
			);

			await expect(promise).rejects.toThrow(ConflictException);
			await expect(promise).rejects.toMatchObject({
				response: {
					statusCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.statusCode,
					customCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.customCode,
					message: AuthStatusCode.EMAIL_ALREADY_EXISTS.message,
				},
			});

			expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
			expect(loggerWarnSpy).toHaveBeenCalledWith(
				`User with email ${mockEmail} already exists`
			);
			expect(loggerDebugSpy).toHaveBeenCalledTimes(1);
		});

		/**
		 * @description Test signUp function when username already exist
		 */
		it('should throw ConflictException when username already exist', async (): Promise<void> => {
			const loggerWarnSpy = jest
				.spyOn(Logger.prototype, 'warn')
				.mockImplementation();
			const loggerDebugSpy = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation();

			userService.getUserByEmail.mockResolvedValue(null);
			userService.getUserByUsername.mockResolvedValue(user);

			const promise: Promise<UserEntityResponseDto> = authService.signUp(
				mockUsername,
				mockEmail,
				mockPassword,
				mockRetypePassword
			);

			await expect(promise).rejects.toThrow(ConflictException);
			await expect(promise).rejects.toMatchObject({
				response: {
					statusCode: AuthStatusCode.USER_ALREADY_EXISTS.statusCode,
					customCode: AuthStatusCode.USER_ALREADY_EXISTS.customCode,
					message: AuthStatusCode.USER_ALREADY_EXISTS.message,
				},
			});

			expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
			expect(loggerWarnSpy).toHaveBeenCalledWith(
				`User with username ${mockUsername} already exists`
			);
			expect(loggerDebugSpy).toHaveBeenCalledTimes(2);
		});

		/**
		 * @description Test signUp function when UserService throws error
		 */
		it('should throw error when UserService throws error', async (): Promise<void> => {
			const error = new Error('DB Connection failed');
			userService.getUserByUsername.mockRejectedValue(error);
			userService.getUserByEmail.mockRejectedValue(error);
			userService.createUserWithUsernameEmailPassword.mockRejectedValue(
				error
			);

			const result: Promise<UserEntityResponseDto> = authService.signUp(
				mockUsername,
				mockEmail,
				mockPassword,
				mockRetypePassword
			);

			await expect(result).rejects.toThrow('DB Connection failed');
		});
	});

	describe('googleLogin', (): void => {
		const user: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.ACTIVE,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		const payload: JwtPayload = {
			id: 1,
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			accessToken: 'mock-token',
		};

		const mockEmail: string = 'nhuttan@gmail.com';
		const mockName: string = 'Nhut Tan';
		const mockPhoto: string = 'http://mockphoto.png';
		const mockToken: string = 'mock-token';

		it('should return JwtPayload when google login successfully', async (): Promise<void> => {
			userService.getUserByEmail.mockResolvedValue(null);
			userService.createNewUserGoogle.mockResolvedValue(user);
			(authMapper.toJwtPayload as jest.Mock).mockReturnValue(payload);
			jwtService.sign.mockReturnValue(mockToken);

			const spyLoggerWarn = jest
				.spyOn(Logger.prototype, 'warn')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation();

			const result: JwtPayload = await authService.googleLogin(
				mockEmail,
				mockName,
				mockPhoto
			);

			expect(result).toEqual(payload);

			expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
			expect(userService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

			expect(userService.createNewUserGoogle).toHaveBeenCalledTimes(1);
			expect(userService.createNewUserGoogle).toHaveBeenCalledWith(
				mockEmail,
				mockName,
				mockPhoto
			);

			expect(authMapper.toJwtPayload).toHaveBeenCalledTimes(1);
			expect(authMapper.toJwtPayload).toHaveBeenCalledWith(user);

			expect(jwtService.sign).toHaveBeenCalledTimes(1);
			expect(jwtService.sign).toHaveBeenCalledWith(payload);

			expect(spyLoggerDebug).toHaveBeenCalledTimes(3);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
		});

		it('should throw Error in UserService', (): void => {
			const error = new Error('DB Connection failed');
			userService.getUserByEmail.mockRejectedValue(error);
			userService.createNewUserGoogle.mockRejectedValue(error);
		});
	});
});
