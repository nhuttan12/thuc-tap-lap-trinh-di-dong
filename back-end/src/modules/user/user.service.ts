/*
 * @description: user service
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { UserResponseDto } from './dtos/user.response.dto';
import { UserMapper } from './mappers/user.mapper';
import { UserStatusCode } from './status-code/user.status.code';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

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
      });
    }

    /*
     * Convert user entity to user response dto
     * */
    const userResponseDto: UserResponseDto = UserMapper.toUserResponseDto(user);

    return userResponseDto;
  }
}
