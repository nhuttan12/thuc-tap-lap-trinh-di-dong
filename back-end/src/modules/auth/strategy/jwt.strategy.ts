/*
 * @description: jwt strategy passport
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-10
 * @version: 1.0.1
 * */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../common/config/config.service';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';
import { UserService } from '../../user/user.service';
import { UserResponseDto } from '../../user/dtos/user.response.dto';
import { UserStatus } from '../../user/enums/user.status.enum';
import { UserStatusCode } from '../../user/status-code/user.status.code';
import { AuthMapper } from '../mapper/auth.mapper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.httpConfig.jwtSecret,
    });
  }

  /*
   * @description: validate function is call when jwt passport is called,
   * this function is called to validate the jwt payload
   * @param: JwtPayloadInterface
   * @return: JwtPayloadInterface
   * @author: Nhut Tan
   * @date: 2025-09-09
   * @modified: 2025-09-10
   * @version: 1.0.0
   * */
  async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
    /*
     * Get user by calling `getUserByUserID` function from user service
     * */
    const user: UserResponseDto = await this.userService.getUserByUserID(
      payload.id,
    );

    /*
     * Validate status user if user banned
     * */
    if (user.status === UserStatus.BANNED.toString()) {
      throw new UnauthorizedException({
        statusCode: UserStatusCode.USER_BANNED.statusCode,
        customCode: UserStatusCode.USER_BANNED.customCode,
      });
    }

    /*
     * Convert user response to jwt payload
     * */
    const jwtPayload: JwtPayloadInterface = AuthMapper.toJwtPayload(user);

    return jwtPayload;
  }
}
