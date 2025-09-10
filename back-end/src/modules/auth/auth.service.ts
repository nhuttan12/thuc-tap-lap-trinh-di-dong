/*
 * @description: auth service
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dtos/user.response.dto';
import { JwtPayloadInterface } from './interface/jwt.payload.interface';
import { AuthMapper } from './mapper/auth.mapper';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../user/enums/user.status.enum';
import { UserStatusCode } from '../user/status-code/user.status.code';
import { UserEntity } from '../user/entities/user.entity';

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
  async validateUserLogin(
    username: string,
    pass: string,
  ): Promise<JwtPayloadInterface> {
    try {
      /*
       * Get `getUserByUserNameAndPasswordForLogin` function from user service
       * */
      const user: UserResponseDto =
        await this.userService.getUserByUserNameAndPasswordForLogin(
          username,
          pass,
        );
      this.logger.debug(
        `Get \`getUserByUserNameAndPasswordForLogin\` function from user service: ${JSON.stringify(user)}`,
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
    } catch (e) {
      this.logger.error(
        `Error in \`validateUser\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  async validateUserGoole(
    email: string,
    name: string,
    photo: string,
    accessToken: string,
  ): Promise<JwtPayloadInterface> {
    try {
      /*
       * Call `getUserByEmail` function from user service
       * */
      let user: UserResponseDto | null =
        await this.userService.getUserByEmail(email);
      this.logger.debug(
        `Call \`getUserByEmail\` function from user service: ${JSON.stringify(user)}`,
      );

      /*
       * Check if user is null
       * */
      if (user === null) {
        /*
         * Create user by google
         * */
        user = await this.userService.createNewUserGoole(
          email,
          name,
          photo,
        );
      }

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
    } catch (e) {
      this.logger.error(
        `Error in \`validateUserGoole\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
