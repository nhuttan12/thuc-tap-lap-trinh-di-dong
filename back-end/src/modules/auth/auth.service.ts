/*
 * @description: auth service
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dtos/user-response.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthMapper } from './mapper/auth.mapper';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../user/enums/user-status.enum';
import { UserStatusCode } from '../user/status-code/user.status-code';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authMapper: AuthMapper,
  ) {}

  /*
   * @description: Validate user by calling `getUserByUserNameAndPasswordForLogin` function from user service
   * @param username: string
   * @param pass: string
   * @returns: Promise<JwtPayloadInterface>
   * @author: Nhut Tan
   * @date: 2025-09-08
   * @version: 1.0.0
   * */
  async userLogin(username: string, pass: string): Promise<JwtPayload> {
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
        throw new ForbiddenException({
          statusCode: UserStatusCode.USER_BANNED.statusCode,
          customCode: UserStatusCode.USER_BANNED.customCode,
          message: UserStatusCode.USER_BANNED.message,
        });
      }

      /*
       * Mapping user response to jwt payload
       * */
      const payload: JwtPayload = this.authMapper.toJwtPayload(user);
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
        `Error in \`userLogin\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: login with Google
   * @param: email: string
   * @param: name: string
   * @param: photo: string
   * @return: Promise<JwtPayloadInterface>
   * @author: Nhut Tan
   * @date: 2025-09-12
   * @version: 1.0.0
   * */
  async googleLogin(
    email: string,
    name: string,
    photo: string,
  ): Promise<JwtPayload> {
    try {
      /*
       * Call `getUserByEmail` function from user service
       * */
      let user: UserResponseDto | null = await this.userService.getUserByEmail(
        email[0],
      );
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
        user = await this.userService.createNewUserGoogle(email, name, photo);
      }

      /*
       * Mapping user response to jwt payload
       * */
      const payload: JwtPayload = this.authMapper.toJwtPayload(user);
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
        `Error in \`googleLogin\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
