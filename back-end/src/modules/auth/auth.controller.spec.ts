/**
 * @description Unit Test file for testing Auth Controller class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { GoogleRequest } from './interface/google-request';
import { JwtPayload } from './interface/jwt-payload.interface';
import { RoleName } from '../role/enums/role-name.enum';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { UserSignUpRequestDto } from './dtos/user-sign-up-request.dto';
import { UserStatus } from '../user/enums/user-status.enum';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

describe('AuthController', (): void => {
	let authController: AuthController;
	let authService: jest.Mocked<AuthService>;

	const mockAuthService = {
		googleLogin: jest.fn(),
		signUp: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		})
			.overrideGuard(GoogleOauthGuard)
			.useValue({ canActivate: jest.fn((): boolean => true) })
			.overrideGuard(LocalAuthGuard)
			.useValue({ canActivate: jest.fn((): boolean => true) })
			.compile();

		authController = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(
			AuthService
		) as jest.Mocked<AuthService>;
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('google callback', (): void => {
		const req: GoogleRequest = {
			user: {
				provider: 'mock-provider',
				providerId: 'mock-prodider-id',
				email: 'mock-email',
				name: 'mock-name',
				picture: 'mock-picture',
			},
		} as Partial<GoogleRequest> as GoogleRequest;

		const payload: JwtPayload = {
			id: 1,
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			accessToken: 'mock-token',
		};

		const mockEmail: string = 'nhuttan@gmail.com';
		const mockName: string = 'Nhut Tan';
		const mockPhoto: string = 'http://mockphoto.png';

		it('should call google login, set cookie, return status ok', async (): Promise<void> => {
			/**
			 * @description Mark googleLogin function result response
			 */
			authService.googleLogin.mockResolvedValue(payload);

			/**
			 * @description Call googleLogin function
			 */
			const result: JwtPayload = await authService.googleLogin(
				mockEmail,
				mockName,
				mockPhoto
			);

			/**
			 * @description Check googleLogin function result response
			 */
			expect(result).toEqual(payload);
			expect(authService.googleLogin).toHaveBeenCalledTimes(1);
			expect(authService.googleLogin).toHaveBeenCalledWith(
				mockEmail,
				mockName,
				mockPhoto
			);

			/**
			 * @description Mock response object
			 */
			const cookie = jest.fn();
			const status = jest.fn().mockReturnThis();

			const res = {
				cookie,
				status,
			} as unknown as Response;

			/**
			 * @description Call AuthController.googleAuthCallback
			 */
			await authController.googleAuthCallback(req as any, res);

			/**
			 * @description Assert cookie is set
			 */
			expect(res.cookie).toHaveBeenCalledWith('access_token', payload, {
				maxAge: 2592000000,
				sameSite: true,
				secure: false,
			});

			/**
			 * @description Assert status is ok
			 */
			expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
		});
	});

	describe('sign up', (): void => {
		const userSignUpRequestDto: UserSignUpRequestDto = {
			email: 'nhuttan@gmail.com',
			username: 'nhuttan',
			password: '123456',
			retypePassword: '123456',
		};

		const user: UserEntityResponseDto = {
			id: 1,
			username: 'nhuttan',
			email: 'nhuttan@gmail.com',
			role: RoleName.CUSTOMER,
			status: UserStatus.ACTIVE,
			createdAt: new Date().toString(),
			updatedAt: new Date().toString(),
		};

		it('should call sign up, return status ok', async (): Promise<void> => {
			/**
			 * @description Mark signUp function result response
			 */
			authService.signUp.mockResolvedValue(user);

			/**
			 * @description Call signUp function
			 */
			const result: UserEntityResponseDto = await authService.signUp(
				userSignUpRequestDto.username,
				userSignUpRequestDto.email,
				userSignUpRequestDto.password,
				userSignUpRequestDto.retypePassword
			);

			/**
			 * @description Check signUp function result response
			 */
			expect(result).toEqual(user);
			expect(authService.signUp).toHaveBeenCalledTimes(1);
			expect(authService.signUp).toHaveBeenCalledWith(
				userSignUpRequestDto.username,
				userSignUpRequestDto.email,
				userSignUpRequestDto.password,
				userSignUpRequestDto.retypePassword
			);
		});
	});
});
