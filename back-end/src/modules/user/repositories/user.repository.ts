/*
 * @description: user repository
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-12
 * @version: 1.0.1
 * */

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
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
   * @param {username: string, password: string}
   * @return {UserEntity | null}
   * @author: Nhut Tan
   * @date: 2025-09-08
   * @version: 1.0.0
   * */
  async getUserByUserNameAndPassword(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    try {
      /*
       * Get user from database and print to log user
       * */
      const user: UserEntity | null = await this.userRepository.findOne({
        where: { username, password },
        relations: {
          role: true,
        },
      });
      this.logger.debug(`Get users from database ${JSON.stringify(user)}`);

      /*
       * Return user to user service
       * */
      return user;
    } catch (e) {
      this.logger.error(
        `Error in \`getUserByUserNameAndPassword\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: Get user by username and password
   * @param {userID: number}
   * @return {UserEntity | null}
   * @author: Nhut Tan
   * @date: 2025-09-09
   * @version: 1.0.0
   * */
  async getUserByUerID(userID: number): Promise<UserEntity | null> {
    try {
      /*
       * Get user from database and print to log user
       * */
      const user: UserEntity | null = await this.userRepository.findOne({
        where: {
          id: userID,
        },
        relations: {
          role: true,
        },
      });
      this.logger.debug(`Get users from database ${JSON.stringify(user)}`);

      /*
       * Return user to user service
       * */
      return user;
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
   * @return {UserEntity | null}
   * @author: Nhut Tan
   * @date: 2025-09-10
   * @version: 1.0.0
   * */
  async getUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      /*
       * Get user from database and print to log user
       * */
      const user: UserEntity | null = await this.userRepository.findOne({
        where: {
          email: email,
        },
        relations: {
          role: true,
        },
      });
      this.logger.debug(`Get users from database ${JSON.stringify(user)}`);

      /*
       * Return user to user service
       * */
      return user;
    } catch (e) {
      this.logger.error(
        `Error in \`getUserByEmail\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: Create user with Google information
   * @param {name: string, email: string, photos: string}
   * @return {UserEntity}
   * @author: Nhut Tan
   * @date: 2025-09-10
   * @version: 1.0.0
   * */
  async createNewUserGoogle(name: string, email: string): Promise<UserEntity> {
    try {
      return await this.dataSource.transaction(async (tx: EntityManager) => {
        /*
         * Create user entity instance
         * */
        const user: UserEntity = tx.create(UserEntity, {
          name: name,
          email: email,
        });

        /*
         * Save it to database
         * */
        return await tx.save(user);
      });
    } catch (e) {
      this.logger.error(
        `Error in \`createNewUserGoogle\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
