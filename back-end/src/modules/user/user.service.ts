/*
 * @description: user service
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-12
 * @version: 1.0.2
 * */

import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserMapper } from './mappers/user.mapper';
import { UserStatusCode } from './status-code/user.status-code';
import { UserStatus } from './enums/user-status.enum';
import { ImageService } from '../image/image.service';
import { ImageEntityResponse } from '../image/dtos/image-entity.response';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly imageService: ImageService,
  ) {}

  /*
   * @description: Get user by username and password for login
   * @author: Nhut Tan
   * @date: 2025-09-08
   * @version: 1.0.0
   * */
  async getUserByUserNameAndPasswordForLogin(
    username: string,
    password: string,
  ): Promise<UserResponseDto> {
    try {
      /*
       * Call `getUserByUserNameAndPassword` function from repository
       * */
      const user: UserEntity | null =
        await this.userRepository.getUserByUserNameAndPassword(
          username,
          password,
        );
      this.logger.debug(
        `Call \`getUserByUserNameAndPassword\` function from repository: ${JSON.stringify(user)}`,
      );

      /*
       * Check user existence
       * */
      if (!user) {
        /*
         * If user not found, throw not found exception
         * */
        this.logger.error(
          `User with username ${username} and password ${password} not found`,
        );
        throw new NotFoundException({
          statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
          customCode: UserStatusCode.USER_NOT_FOUND.customCode,
          message: UserStatusCode.USER_NOT_FOUND.message,
        });
      }

      /*
       * Convert user entity to user response dto
       * */
      const userResponseDto: UserResponseDto =
        this.userMapper.toUserResponseDto(user);
      this.logger.debug(
        `Convert user entity to user response dto: ${JSON.stringify(userResponseDto)}`,
      );

      return userResponseDto;
    } catch (e) {
      this.logger.error(
        `Error in \`getUserByUserNameAndPasswordForLogin\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: Get user by user ID
   * @author: Nhut Tan
   * @date: 2025-09-10
   * @version: 1.0.0
   * */
  async getUserByUserID(userID: number): Promise<UserResponseDto> {
    try {
      /*
       * Call `getUserByUserID` function from repository
       * */
      const user: UserEntity | null =
        await this.userRepository.getUserByUerID(userID);
      this.logger.debug(
        `Call \`getUserByUserID\` function from repository: ${JSON.stringify(user)} `,
      );

      /*
       * Check user existence
       * */
      if (!user) {
        /*
         * If user not found, throw not found exception
         * */
        this.logger.error(`User with userID ${userID} not found`);
        throw new NotFoundException({
          statusCode: UserStatusCode.USER_NOT_FOUND.statusCode,
          customCode: UserStatusCode.USER_NOT_FOUND.customCode,
          message: UserStatusCode.USER_NOT_FOUND.message,
        });
      }

      /*
       * Convert user entity to user response dto
       * */
      const userResponseDto: UserResponseDto =
        this.userMapper.toUserResponseDto(user);
      this.logger.debug(
        `Convert user entity to user response dto: ${JSON.stringify(userResponseDto)}`,
      );

      return userResponseDto;
    } catch (e) {
      this.logger.error(
        `Error in \`getUserByUserID\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: Get user by email
   * @param {email: string}
   * @return {UserResponseDto | null}
   * @author: Nhut Tan
   * @date: 2025-09-10
   * @version: 1.0.0
   * */
  async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    try {
      /*
       * Call `getUserByEmail` function from repository
       * */
      const user: UserEntity | null =
        await this.userRepository.getUserByEmail(email);
      this.logger.debug(
        `Call \`getUserByEmail\` function from repository: ${JSON.stringify(user)} `,
      );

      /*
       * Check user existence
       * */
      if (!user) {
        /*
         * If user not exist, return null
         * */
        return null;
      }

      /*
       * Validate status user if user banned
       * */
      if (user.status === (UserStatus.BANNED as UserStatus)) {
        throw new ForbiddenException({
          statusCode: UserStatusCode.USER_BANNED.statusCode,
          customCode: UserStatusCode.USER_BANNED.customCode,
          message: UserStatusCode.USER_BANNED.message,
        });
      }

      /*
       * Convert user entity to user response dto
       * */
      const userResponseDto: UserResponseDto =
        this.userMapper.toUserResponseDto(user);
      this.logger.debug(
        `Convert user entity to user response dto: ${JSON.stringify(userResponseDto)}`,
      );

      return userResponseDto;
    } catch (e) {
      this.logger.error(
        `Error in \`getUserByEmail\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  async createNewUserGoogle(
    email: string,
    name: string,
    imageUrl: string,
  ): Promise<UserResponseDto> {
    try {
      /*
       * Create new user with Google information
       * */
      const user: UserEntity = await this.userRepository.createNewUserGoogle(
        name,
        email,
      );
      this.logger.debug(
        `Call \`createNewUserGoogle\` function from repository: ${JSON.stringify(user)}`,
      );

      /*
       * Call `create image` in image service
       * */
      const image: ImageEntityResponse = await this.imageService.createImage(
        imageUrl,
        user.id,
      );
      this.logger.debug(
        `Call \`createImage\` function from image service: ${JSON.stringify(image)}`,
      );

      /*
       * Convert user to user response dto
       * */
      const userResponseDto: UserResponseDto =
        this.userMapper.toUserResponseDto(user);
      this.logger.debug(
        `Convert user to user response dto: ${JSON.stringify(user)}`,
      );

      return userResponseDto;
    } catch (e) {
      this.logger.error(
        `Error in \`createNewUserGoogle\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
