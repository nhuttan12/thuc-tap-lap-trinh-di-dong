/**
 * @description auth controller for login user
 * @author Nhut Tan
 * @since 2025-09-09
 * @version 1.0.0
 */

import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Logger,
	Post,
	Req,
	Request,
	Res,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthRequest } from './interface/auth-request.interface';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { GoogleRequest } from './interface/google-request';
import { GoogleLogin } from './interface/google-login.interface';
import { Response } from 'express';
import { UserSignUpRequestDto } from './dtos/user-sign-up-request.dto';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { CatchEverythingFilter } from '../../common/filter/catch-everything.filter';
import { ForgotPasswordResponseDto } from './dtos/forgot-password-response.dto';
import { VerifyOtpResponseDto } from './dtos/user-verify-otp-response.dto';
import { ResetPasswordResponseDto } from './dtos/reset-password-response.dto';
import { ForgotPasswordRequestDto } from './dtos/forgot-pw-request.dto';
import { VerifyOtpRequestDto } from './dtos/verify-otp-request.dto';
import { ResetPasswordRequestDto } from './dtos/reset-pw-request.dto';

@Controller('auth')
@UseFilters(CatchEverythingFilter)
export class AuthController {
	private readonly logger: Logger = new Logger(AuthController.name);

	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService
	) {}

	/**
	 * @description login user via local strategy passport
	 * @param {AuthRequest} req - Auth request to log in with local service
	 * @return JwtPayload
	 * @author Nhut Tan
	 * @since 2025-09-09
	 * @version 1.0.0
	 */
	@UseGuards(LocalAuthGuard)
	@Post('login')
	login(@Request() req: AuthRequest): JwtPayload {
		return req.user;
	}

	/**
	 * @description login user via Google strategy passport
	 * @author Nhut Tan
	 * @since 2025-09-09
	 * @version 1.0.0
	 */
	@Get('google')
	@UseGuards(GoogleOauthGuard)
	async auth(): Promise<void> {}

	/**
	 * @description callback from Google strategy passport
	 * @param {GoogleRequest} req - Google request to log in with Google service
	 * @param {Response} res - Response of log in Google
	 * @author Nhut Tan
	 * @since 2025-09-09
	 * @version 1.0.0
	 */
	@Get('google/callback')
	@UseGuards(GoogleOauthGuard)
	async googleAuthCallback(@Req() req: GoogleRequest, @Res() res: Response) {
		const user: GoogleLogin = req.user;
		const token: JwtPayload = await this.authService.googleLogin(
			user.email,
			user.name,
			user.picture
		);

		res.cookie('access_token', token, {
			maxAge: 2592000000,
			sameSite: true,
			secure: false,
		});

		return res.status(HttpStatus.OK);
	}

	/**
	 * @description Sign up user
	 * @param {UserSignUpRequestDto} request - User sign up request
	 * @return {Promise<UserEntityResponseDto>}
	 * @author Nhut Tan
	 * @since 2025-09-17
	 * @version 1.0.0
	 */
	@Post('sign-up')
	async signUp(
		@Body() request: UserSignUpRequestDto
	): Promise<UserEntityResponseDto> {
		return await this.authService.signUp(
			request.username,
			request.email,
			request.password,
			request.retypePassword
		);
	}

	@Post('forgot-password')
	async forgotPassword(
		@Body() request: ForgotPasswordRequestDto
	): Promise<ForgotPasswordResponseDto> {
		return this.authService.forgotPassword(request.email);
	}

	/** Verify OTP */
	@Post('verify-otp')
	async verifyOtp(
		@Body() body: VerifyOtpRequestDto
	): Promise<VerifyOtpResponseDto> {
		return this.authService.verifyOtp(body.email, body.otp);
	}

	/** Reset password */
	@Post('reset-password')
	async resetPassword(
		@Body() body: ResetPasswordRequestDto
	): Promise<ResetPasswordResponseDto> {
		return this.authService.resetPassword(
			body.resetToken,
			body.newPassword
		);
	}
}
