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
import { AuthStatusCode } from './status-code/auth.status-code';

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

  /**
   * @description: Sign up user
   * @param username
   * @param password
   * @param email
   * @param retypePassword
   * @author: Nhut Tan
   * @date: 2025-09-17
   */
  async signUp(
    username: string,
    email: string,
    password: string,
    retypePassword: string,
  ): Promise<UserResponseDto> {
    try {
      /**
       * Check for similarities between `password` and `retypePassword`
       */
      if (password !== retypePassword) {
        this.logger.warn(`Password and retypePassword are not the same`);
        throw new ForbiddenException({
          statusCode:
            AuthStatusCode.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
              .statusCode,
          customCode:
            AuthStatusCode.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
              .customCode,
          message:
            AuthStatusCode.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME
              .message,
        });
      }

      /**
       * Get user by email
       */
      const user: UserResponseDto | null =
        await this.userService.getUserByEmail(email);
      this.logger.debug(`Get user by email: ${JSON.stringify(user)}`);

      /**
       * Check if user is null
       */
      if (user) {
        this.logger.warn(`User with email ${email} already exists`);
        throw new ForbiddenException({
          statusCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.statusCode,
          customCode: AuthStatusCode.EMAIL_ALREADY_EXISTS.customCode,
          message: AuthStatusCode.EMAIL_ALREADY_EXISTS.message,
        });
      }

      /**
       * Check user exist with username
       */
      const userByUsername: UserResponseDto =
        await this.userService.getUserByUsername(username);
      this.logger.debug(
        `Get user by username: ${JSON.stringify(userByUsername)}`,
      );

      /**
       * Create user with username, email, password
       */
      const userCreated: UserResponseDto =
        await this.userService.createUserWithUsernameEmailPassword(
          username,
          email,
          password,
        );
      this.logger.debug(
        `Create user with username, email, password: ${JSON.stringify(userCreated)}`,
      );

      /**
       * Return user created
       */
      return userCreated;
    } catch (e) {
      this.logger.error(
        `Error in \`signUp\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

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
