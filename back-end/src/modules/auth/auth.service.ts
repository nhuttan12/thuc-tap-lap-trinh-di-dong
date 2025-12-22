/*
 * @description auth service
 * @author Nhut Tan
 * @since 2025-09-08
 * @version 1.0.0
 */

import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntityResponseDto } from '../user/dtos/user-entity-response.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthMapper } from './mapper/auth.mapper';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../user/enums/user-status.enum';
import { UserStatusCode } from '../user/status-code/user.status-code';
import { AuthStatusCode } from './status-code/auth.status-code';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/entities/user.entity';
import { ForgotPasswordResponseDto } from './dtos/forgot-password-response.dto';
import {UserAuthenticationRepository} from "../user/repositories/user-authentication.repository";
import {VerifyOtpResponseDto} from "./dtos/user-verify-otp-response.dto";
import {ResetPasswordResponseDto} from "./dtos/reset-password-response.dto";

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly authMapper: AuthMapper,
        private readonly userAuthRepo: UserAuthenticationRepository,
	) {}

	/*
	 * @description Validate user by calling `getUserByUserNameAndPasswordForLogin` function from user service
	 * @param username: string
	 * @param pass: string
	 * @returns: Promise<JwtPayloadInterface>
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @version 1.0.0
	 */
	async userLogin(username: string, password: string): Promise<JwtPayload> {
		try {
			/*
			 * Get `getUserByUserNameAndPasswordForLogin` function from user service
			 */
			const user: UserEntityResponseDto =
				await this.userService.getUserByUserNameAndPasswordForLogin(
					username,
					password
				);
			this.logger.debug(
				`Get \`getUserByUserNameAndPasswordForLogin\` function from user service: ${JSON.stringify(user)}`
			);

			/*
			 * Validate status user if user banned
			 */
			if (user.status === UserStatus.BANNED.toString()) {
				throw new ForbiddenException({
					statusCode: UserStatusCode.USER_BANNED.statusCode,
					customCode: UserStatusCode.USER_BANNED.customCode,
					message: UserStatusCode.USER_BANNED.message,
				});
			}

			/*
			 * Mapping user response to jwt payload
			 */
			const payload: JwtPayload = this.authMapper.toJwtPayload(user);
			this.logger.debug(
				`Mapping user response to jwt payload: ${JSON.stringify(payload)}`
			);

			/*
			 * Sign token and declare to payload
			 */
			payload.accessToken = this.jwtService.sign(payload);
			this.logger.debug(`Token after sign: ${JSON.stringify(payload)}`);

			/*
			 * Return jwt payload
			 */
			return payload;
		} catch (e) {
			this.logger.error(
				`Error in \`userLogin\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Sign up user
	 * @param username
	 * @param password
	 * @param email
	 * @param retypePassword
	 * @author Nhut Tan
	 * @since 2025-09-17
	 */
	async signUp(
		username: string,
		email: string,
		password: string,
		retypePassword: string
	): Promise<UserEntityResponseDto> {
		try {
			/**
			 * Check for similarities between `password` and `retypePassword`
			 */
			if (password !== retypePassword) {
				this.logger.warn(
					`Password and retypePassword are not the same`
				);
				throw new BadRequestException({
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
				});
			}

			/**
			 * Get user by email
			 */
			const user: UserEntityResponseDto | null =
				await this.userService.getUserByEmail(email);
			this.logger.debug(`Get user by email: ${JSON.stringify(user)}`);

			/**
			 * Check if user is null
			 */
			if (user) {
				this.logger.warn(`User with email ${email} already exists`);
				throw new ConflictException({
					statusCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.statusCode,
					customCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.customCode,
					message: AuthStatusCode.EMAIL_ALREADY_EXISTS.message,
				});
			}

			/**
			 * Check user exist with username
			 */
			const userByUsername: UserEntityResponseDto | null =
				await this.userService.getUserByUsername(username);
			this.logger.debug(
				`Get user by username: ${JSON.stringify(userByUsername)}`
			);

			/**
			 * Check if user is null
			 */
			if (userByUsername) {
				this.logger.warn(
					`User with username ${username} already exists`
				);
				throw new ConflictException({
					statusCode: AuthStatusCode.USER_ALREADY_EXISTS.statusCode,
					customCode: AuthStatusCode.USER_ALREADY_EXISTS.customCode,
					message: AuthStatusCode.USER_ALREADY_EXISTS.message,
				});
			}

			/**
			 * Create user with username, email, password
			 */
			const userCreated: UserEntityResponseDto =
				await this.userService.createUserWithUsernameEmailPassword(
					username,
					email,
					password
				);
			this.logger.debug(
				`Create user with username, email, password: ${JSON.stringify(userCreated)}`
			);

			/**
			 * Return user created
			 */
			return userCreated;
		} catch (e) {
			this.logger.error(
				`Error in \`signUp\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	async googleLogin(
		email: string,
		name: string,
		photo: string
	): Promise<JwtPayload> {
		try {
			/*
			 * Call `getUserByEmail` function from user service
			 */
			let user: UserEntityResponseDto | null =
				await this.userService.getUserByEmail(email);
			this.logger.debug(
				`Call \`getUserByEmail\` function from user service: ${JSON.stringify(user)}`
			);

			/*
			 * Check if user is null
			 */
			if (user === null) {
				/*
				 * Create user by google
				 */
				user = await this.userService.createNewUserGoogle(
					email,
					name,
					photo
				);
			}

			/*
			 * Mapping user response to jwt payload
			 */
			const payload: JwtPayload = this.authMapper.toJwtPayload(user);
			this.logger.debug(
				`Mapping user response to jwt payload: ${JSON.stringify(payload)}`
			);

			/*
			 * Sign token and declare to payload
			 */
			payload.accessToken = this.jwtService.sign(payload);
			this.logger.debug(`Token after sign: ${JSON.stringify(payload)}`);

			/*
			 * Return jwt payload
			 */
			return payload;
		} catch (e) {
			this.logger.error(
				`Error in \`googleLogin\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

    /**
     * @description
     * Gửi OTP về email khi user quên mật khẩu
     *
     * @flow
     * - User nhập email
     * - Sinh OTP 6 số
     * - Hash OTP và lưu DB
     * - Gửi OTP qua email
     */
    async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
        // 1. Kiểm tra user tồn tại
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new BadRequestException('User không tồn tại');
        }

        // 2. Tạo OTP 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Hash OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        // 4. Tạo hoặc cập nhật userAuth
        let userAuth = await this.userAuthRepo.findByUserId(user.id);
        if (!userAuth) {
            userAuth = this.userAuthRepo.create(user.id);
        }
        userAuth.resetOtp = hashedOtp;
        userAuth.resetOtpExpiration = Date.now() + 3 * 60 * 1000; // 3 phút
        userAuth.resetToken = null; // reset token sẽ cấp sau verify OTP
        await this.userAuthRepo.save(userAuth);

        // 5. Gửi OTP bằng nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'taitanvo16@gmail.com',
                pass: 'yulu zcuc hnhm yeql',
            },
        });

        await transporter.sendMail({
            from: '"E-Commerce App" <no-reply@app.com>',
            to: user.email,
            subject: 'Mã OTP khôi phục mật khẩu',
            html: `<p>Mã OTP của bạn là: <b>${otp}</b></p>
                   <p>OTP có hiệu lực trong 3 phút.</p>`,
        });

        return { message: 'OTP đã được gửi về email' };
    }



    /**
     * @description
     * Xác thực OTP người dùng nhập
     *
     * @flow
     * - So sánh OTP user nhập với OTP hash
     * - Nếu đúng → sinh resetToken
     * - Xoá OTP
     */
    async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponseDto> {
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new BadRequestException('User không tồn tại');

        const userAuth = await this.userAuthRepo.findByUserId(user.id);
        if (!userAuth || !userAuth.resetOtp)
            throw new BadRequestException('OTP không tồn tại');

        if (Date.now() > userAuth.resetOtpExpiration!)
            throw new BadRequestException('OTP đã hết hạn');

        const isMatch = await bcrypt.compare(otp, userAuth.resetOtp);
        if (!isMatch) throw new BadRequestException('OTP không đúng');

        // OTP đúng -> tạo reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        userAuth.resetToken = resetToken;
        userAuth.resetTokenExpiration = Date.now() + 5 * 60 * 1000; // 5 phút
        userAuth.resetOtp = null; // xóa OTP đã dùng
        userAuth.resetOtpExpiration = null;
        await this.userAuthRepo.save(userAuth);

        return { token: resetToken };
    }

    async resetPassword(resetToken: string, newPassword: string): Promise<ResetPasswordResponseDto> {
        const userAuth = await this.userAuthRepo.findByResetToken(resetToken);
        if (!userAuth) throw new BadRequestException('Reset token không hợp lệ');

        if (Date.now() > userAuth.resetTokenExpiration!)
            throw new BadRequestException('Reset token đã hết hạn');

        const user = await this.userService.getUserEntityById(userAuth.userId);
        if (!user) throw new BadRequestException('User không tồn tại');

        // Hash password mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userService.updateUserEntity(user);

        // Xóa reset token
        userAuth.resetToken = null;
        userAuth.resetTokenExpiration = null;
        await this.userAuthRepo.save(userAuth);

        return { message: 'Cập nhật mật khẩu thành công' };
    }

}
