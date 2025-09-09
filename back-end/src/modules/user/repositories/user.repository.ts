/*
 * @description: user repository
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

export class UserRepository {
  private readonly logger: Logger = new Logger(UserRepository.name);

  /*
   * @description: constructor of user repository class
   * @author: Nhut Tan
   * @date: 2025-09-08
   * @version: 1.0.0
   * */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /*
   * @description: Get user by username and password
   * @author: Nhut Tan
   * @date: 2025-09-08
   * @version: 1.0.0
   * */
  async getUserByUserNameAndPassword(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    /*
     * Get user from database and print to log user
     * */
    const users: UserEntity | null = await this.userRepository.findOne({
      where: { username, password },
      relations: {
        role: true,
      },
    });
    this.logger.debug(`Get users from database ${JSON.stringify(users)}`);

    /*
     * Return user to user service
     * */
    return users;
  }
}
