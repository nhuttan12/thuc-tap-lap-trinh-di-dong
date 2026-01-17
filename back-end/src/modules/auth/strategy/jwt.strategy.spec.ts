/**
 * @description Unit Test for JwtStrategy using Jest.
 * 				Test that JwtStrategy.validate called UserService.getUserByUserID
 * 				correctly and return expect payload.
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-12
 * @version 1.0.2
 */

import { UserService } from '../../user/user.service';
import { ConfigService } from '../../../common/config/config.service';
import { AuthMapper } from '../mapper/auth.mapper';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { UserEntityResponseDto } from 'src/modules/user/dtos/user-entity-response.dto';
import { ForbiddenException, Logger } from '@nestjs/common';
import { UserStatus } from '../../user/enums/user-status.enum';
import { RoleName } from '../../role/enums/role-name.enum';
import { UserStatusCode } from '../../user/status-code/user.status-code';

describe('JwtStrategy', () => {
	let jwtStrategy: JwtStrategy;
	let userService: jest.Mocked<UserService>;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let configService: jest.Mocked<ConfigService>;
	let authMapper: jest.Mocked<AuthMapper>;

	/**
	 * @description Mocked http config
	 */
	const mockHttpConfig = {
		httpConfig: {
			jwtSecret: 'secretKey',
		},
	};

	/**
	 * @description Mocked user service
	 */
	const mockUserService = {
		getUserByUserID: jest.fn(),
	};

	/**
	 * @description Mocked auth mapper
	 */
	const mockAuthMapper = {
		toJwtPayload: jest.fn(),
	};

	/**
	 * @description Mocked payload
	 */
	const payload: JwtPayload = {
		id: 1,
		email: 'nhuttan@gmail.com',
		role: 'CUSTOMER',
		accessToken: 'asdkjasdj',
	};

	/**
	 * @description Mocked user
	 */
	const user: UserEntityResponseDto = {
		id: 1,
		username: 'nhuttan',
		email: 'nhuttan@gmail.com',
		role: 'CUSTOMER',
		status: 'ACTIVE',
		createdAt: new Date().toString(),
		updatedAt: new Date().toString(),
	};

	/**
	 * @description Mocked payload mapping
	 */
	const payloadMapping: JwtPayload = {
		id: 1,
		email: 'nhuttan@gmail.com',
		role: 'CUSTOMER',
		accessToken: 'asdkjasdj',
	};

	/**
	 * @description Setup NestJS testing module and inject mocked dependencies.
	 */
	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtStrategy,
				{
					provide: ConfigService,
					useValue: mockHttpConfig,
				},
				{
					provide: UserService,
					useValue: mockUserService,
				},
				{
					provide: AuthMapper,
					useValue: mockAuthMapper,
				},
			],
		}).compile();

		jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
		configService = module.get<ConfigService>(ConfigService);
		userService = module.get<UserService>(
			UserService
		) as jest.Mocked<UserService>;
		authMapper = module.get<AuthMapper>(
			AuthMapper
		) as jest.Mocked<AuthMapper>;

		jest.clearAllMocks();
	});

	/**
	 * @description Test that the JwtStrategy instance is defined.
	 */
	it('should be define', (): void => {
		expect(jwtStrategy).toBeDefined();
	});

	/**
	 * @description Test that the JwtStrategy calls userService.getUserByUserID and returns a UserEntityResponseDto.
	 */
	it('should call userService.getUserByUserID and return a UserEntityResponseDto', async (): Promise<void> => {
		mockUserService.getUserByUserID.mockResolvedValue(user);

		const result: UserEntityResponseDto = await userService.getUserByUserID(
			payload.id
		);

		expect(userService.getUserByUserID).toHaveBeenCalledTimes(1);
		expect(userService.getUserByUserID).toHaveBeenCalledWith(payload.id);

		expect(result).toEqual(user);
	});

	/**
	 * @description Test that Logging debug message after call GetUserByID.
	 */
	it('should debug message after call GetUserByID', async (): Promise<void> => {
		const loggerSpy = jest
			.spyOn(Logger.prototype, 'debug')
			.mockImplementation((): void => {});

		await jwtStrategy.validate(payload);

		expect(loggerSpy.mock.calls[0][0]).toBe(
			`Get user by calling \`getUserByUserID\` function from user service: ${JSON.stringify(user, null, 2)}`
		);
	});

	/**
	 * @description Test that the JwtStrategy throws ForbiddenException if user have banned status.
	 */
	it('should throw ForbiddenException if user have banned status', async (): Promise<void> => {
		const bannedUser: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.BANNED,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		mockUserService.getUserByUserID.mockResolvedValue(bannedUser);

		await expect(jwtStrategy.validate(payload)).rejects.toThrowError(
			ForbiddenException
		);

		await expect(jwtStrategy.validate(payload)).rejects.toMatchObject({
			response: {
				statusCode: UserStatusCode.USER_BANNED.statusCode,
				customCode: UserStatusCode.USER_BANNED.customCode,
				message: UserStatusCode.USER_BANNED.message,
			},
		});
	});

	/**
	 * @description Test that the JwtStrategy convert user response to jwt payload if not meet error.
	 */
	it('should convert user response to jwt payload if not meet error', async (): Promise<void> => {
		mockAuthMapper.toJwtPayload.mockResolvedValue(payloadMapping);
		mockUserService.getUserByUserID.mockResolvedValue(user);

		const result: JwtPayload = await jwtStrategy.validate(payload);

		expect(authMapper.toJwtPayload).toHaveBeenCalledTimes(1);
		expect(authMapper.toJwtPayload).toHaveBeenCalledWith(user);

		expect(result).toEqual(payloadMapping);
	});

	/**
	 * @description Test that the JwtStrategy debug message after convert user response to jwt payload.
	 */
	it('should debug message after convert user response to jwt payload', async (): Promise<void> => {
		const loggerSpy = jest
			.spyOn(Logger.prototype, 'debug')
			.mockImplementation((): void => {});

		mockAuthMapper.toJwtPayload.mockReturnValue(payloadMapping);

		await jwtStrategy.validate(payload);

		expect(loggerSpy.mock.calls[1][0]).toBe(
			`Convert user response to jwt payload: ${JSON.stringify(payloadMapping, null, 2)}`
		);
	});
});
