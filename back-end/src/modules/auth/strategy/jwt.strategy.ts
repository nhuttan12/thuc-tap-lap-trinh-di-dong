/*
 * @description jwt strategy passport
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-12
 * @version 1.0.1
 */

import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../common/config/config.service';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { UserService } from '../../user/user.service';
import { UserEntityResponseDto } from '../../user/dtos/user-entity-response.dto';
import { UserStatus } from '../../user/enums/user-status.enum';
import { UserStatusCode } from '../../user/status-code/user.status-code';
import { AuthMapper } from '../mapper/auth.mapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger: Logger = new Logger(JwtStrategy.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly authMapper: AuthMapper
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.httpConfig.jwtSecret,
		});
	}

	/**
	 * @description Validate function is call when jwt passport is called,
	 * 				this function is called to validate the jwt payload
	 *
	 * @param {JwtPayload} payload - payload use to validate for each of request
	 * @return {Promise<JwtPayload>} - Return jwt payload if validate success
	 *
	 * @author Nhut Tan
	 * @since 2025-09-09
	 * @modifies 2025-09-10
	 * @version 1.0.0
	 */
	async validate(payload: JwtPayload): Promise<JwtPayload> {
		/*
		 * Get user by calling `getUserByUserID` function from user service
		 */
		const user: UserEntityResponseDto =
			await this.userService.getUserByUserID(payload.id);
		this.logger.debug(
			`Get user by calling \`getUserByUserID\` function from user service: ${JSON.stringify(user, null, 2)}`
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
		 * Convert user response to jwt payload
		 */
		const jwtPayload: JwtPayload = this.authMapper.toJwtPayload(user);
		this.logger.debug(
			`Convert user response to jwt payload: ${JSON.stringify(jwtPayload, null, 2)}`
		);

		return jwtPayload;
	}
}
