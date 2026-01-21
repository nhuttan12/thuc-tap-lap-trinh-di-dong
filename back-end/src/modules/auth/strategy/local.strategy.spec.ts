/**
 * @description Unit test for LocalStrategy using Jest.
 * 				Test that LocalStrategy.validate called AuthService.userLogin
 * 				correctly and return expect payload.
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-10
 * @version 1.0.1
 */

import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Logger } from '@nestjs/common';
import { UserLoginRequestDto } from '../dtos/user-login-request.dto';

describe('LocalStrategy', (): void => {
	let localStrategy: LocalStrategy;
	let authService: jest.Mocked<AuthService>;

	const mockAuthService = {
		userLogin: jest.fn(),
	};

	/**
	 * @description Setup NestJS testing module and inject mocked AuthService.
	 */
	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LocalStrategy,
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		}).compile();

		localStrategy = module.get<LocalStrategy>(LocalStrategy);
		authService = module.get<AuthService>(
			AuthService
		) as jest.Mocked<AuthService>;

		jest.spyOn(Logger.prototype, 'debug').mockImplementation(
			(): void => {}
		);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	/**
	 * @description Test that the LocalStrategy instance is defined.
	 */
	it('should be define', (): void => {
		expect(localStrategy).toBeDefined();
	});

	/**
	 * @description Test that validate calls AuthService.userLogin with correct arguments
	 *              and returns the expected JWT payload.
	 */
	it('should authService.userLogin and return a user payload', async (): Promise<void> => {
		const mockUser: JwtPayload = {
			id: 1,
			email: 'nhuttan@gmail.com',
			role: 'CUSTOMER',
			accessToken: 'asdkjasdj',
		};

		const loginDto: UserLoginRequestDto = {
			username: 'nhuttan',
			password: '123123',
		};

		mockAuthService.userLogin.mockResolvedValue(mockUser);

		const result: JwtPayload = await localStrategy.validate(
            loginDto.username,
            loginDto.password);

		expect(authService.userLogin).toHaveBeenCalledTimes(1);
		expect(authService.userLogin).toHaveBeenCalledWith(
			loginDto.username,
			loginDto.password
		);

		expect(result).toEqual(mockUser);
	});

	/**
	 * @description Test that LocalStrategy.validate triggers Logger.debug
	 *              with the correct user payload after validation.
	 */
	it('should debug message after validating user', async (): Promise<void> => {
		const mockPayload: JwtPayload = {
			id: 1,
			email: 'nhuttan@gmail.com',
			role: 'CUSTOMER',
			accessToken: 'asdkjasdj',
		};

		const loginDto: UserLoginRequestDto = {
			username: 'nhuttan',
			password: '123123',
		};

		const loggerSpy = jest
			.spyOn(Logger.prototype, 'debug')
			.mockImplementation((): void => {});

		await localStrategy.validate(
            loginDto.username,
            loginDto.password);

		expect(loggerSpy).toHaveBeenCalledTimes(1);
		expect(loggerSpy).toHaveBeenCalledWith(
			`User after validate: ${JSON.stringify(mockPayload, null, 2)}`
		);
	});
});
