/*
 * @description: auth service
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dtos/user.response.dto';
import { JwtPayloadInterface } from './interface/jwt.payload.interface';
import { AuthMapper } from './mapper/auth.mapper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /*
   * Validate user by calling `getUserByUserNameAndPasswordForLogin` function from user service
   * */
  async validateUser(
    username: string,
    pass: string,
  ): Promise<JwtPayloadInterface> {
    /*
     * Get `getUserByUserNameAndPasswordForLogin` function from user service
     * */
    const user: UserResponseDto =
      await this.userService.getUserByUserNameAndPasswordForLogin(
        username,
        pass,
      );
    this.logger.debug(
      `Get user by username and password for login: ${JSON.stringify(user)}`,
    );

    /*
     * Mapping user response to jwt payload
     * */
    const payload: JwtPayloadInterface = AuthMapper.toJwtPayload(user);
    this.logger.debug(
      `Mapping user response to jwt payload: ${JSON.stringify(payload)}`,
    );

    /*
     * Sign token and declare to payload
     * */
    payload.accessToken = this.jwtService.sign(payload);
    this.logger.debug(`Token after sign: ${JSON.stringify(payload)}`);

    /*
     * Return jwt payload
     * */
    return payload;
  }
}
