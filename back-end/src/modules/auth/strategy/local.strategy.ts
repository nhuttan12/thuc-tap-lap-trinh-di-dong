/**
 * @description local strategy passport
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-10
 * @version 1.0.1
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserLoginRequestDto } from '../dtos/user-login-request.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private readonly logger: Logger = new Logger(LocalStrategy.name);

	constructor(private readonly authService: AuthService) {
		super();
	}

	/**
	 * @description - Validate function is call when local passport is called
	 * @param {UserLoginRequestDto} username, password - username and password to login
	 * @return {Promise<JwtPayload>}
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @modifies 2025-09-10
	 * @version 1.0.1
	 */
	async validate({
		username,
		password,
	}: UserLoginRequestDto): Promise<JwtPayload> {
		/**
		 * Get user by username and password
		 */
		const user: JwtPayload = await this.authService.userLogin(
			username,
			password
		);
		this.logger.debug(
			`User after validate: ${JSON.stringify(user, null, 2)}`
		);

		/**
		 * Return user
		 */
		return user;
	}
}
