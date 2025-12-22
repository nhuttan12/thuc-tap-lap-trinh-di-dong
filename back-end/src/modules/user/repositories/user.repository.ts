/**
 * @description user repository
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-22
 * @version 1.0.3
 */

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RoleEntity } from '../../role/entities/role.entity';
import { RoleName } from '../../role/enums/role-name.enum';
import { ImageEntity } from '../../image/entities/image.entity';

export class UserRepository {
	private readonly logger: Logger = new Logger(UserRepository.name);

	/*
	 * @description constructor of user repository class
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @version 1.0.0
	 */
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly dataSource: DataSource
	) {}

	/*
	 * @description Get user by username and password
	 * @param {username: string, password: string}
	 * @return {UserEntity | null}
	 * @author Nhut Tan
	 * @since 2025-09-08
	 * @version 1.0.0
	 */
	async getUserByUserNameAndPassword(
		username: string,
		password: string
	): Promise<UserEntity | null> {
		try {
			/*
			 * Get user from database and print to log user
			 */
			const user: UserEntity | null = await this.userRepository.findOne({
				where: { username, password },
				relations: {
					role: true,
				},
			});
			this.logger.debug(
				`Get users from database ${JSON.stringify(user)}`
			);

			/*
			 * Return user to user service
			 */
			return user;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUserNameAndPassword\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/*
	 * @description Get user by username and password
	 * @param {userID: number}
	 * @return {UserEntity | null}
	 * @author Nhut Tan
	 * @since 2025-09-09
	 * @version 1.0.0
	 */
	async getUserByUerID(userID: number): Promise<UserEntity | null> {
		try {
			/*
			 * Get user from database and print to log user
			 */
			const user: UserEntity | null = await this.userRepository.findOne({
				where: {
					id: userID,
				},
				relations: {
					role: true,
				},
			});
			this.logger.debug(
				`Get users from database ${JSON.stringify(user)}`
			);

			/*
			 * Return user to user service
			 */
			return user;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUserID\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/*
	 * @description Get user by email
	 * @param {email: string}
	 * @return {UserEntity | null}
	 * @author Nhut Tan
	 * @since 2025-09-10
	 * @version 1.0.0
	 */
	async getUserByEmail(email: string): Promise<UserEntity | null> {
		try {
			/*
			 * Get user from database and print to log user
			 */
			const user: UserEntity | null = await this.userRepository.findOne({
				where: {
					email: email,
				},
				relations: {
					role: true,
				},
			});
			this.logger.debug(
				`Get users from database ${JSON.stringify(user)}`
			);

			/*
			 * Return user to user service
			 */
			return user;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByEmail\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/*
	 * @description Create user with Google information
	 * @param {name: string, email: string, photos: string}
	 * @return {UserEntity}
	 * @author Nhut Tan
	 * @since 2025-09-10
	 * @version 1.0.0
	 */
	async createNewUserGoogle(
		name: string,
		email: string
	): Promise<UserEntity> {
		try {
			return await this.dataSource.transaction(
				async (tx: EntityManager) => {
					/*
					 * Create user entity instance
					 */
					const user: UserEntity = tx.create(UserEntity, {
						name: name,
						email: email,
					});

					/*
					 * Save it to database
					 */
					return await tx.save(user);
				}
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createNewUserGoogle\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Get user by username
	 * @param username
	 */
	async getUserByUsername(username: string): Promise<UserEntity | null> {
		try {
			/**
			 * Get user from database
			 */
			const users: UserEntity | null = await this.userRepository.findOne({
				where: {
					username: username,
				},
			});
			this.logger.debug(
				`Get user from database ${JSON.stringify(users)}`
			);

			return users;
		} catch (e) {
			this.logger.error(
				`Error in \`getUserByUsername\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}

	/**
	 * @description Create user with username, email and password with default
	 * role is customer, full name is `Nguười dùng ${uuid}`, default image url is
	 * 'https://res.cloudinary.com/dt3yrf9sx/image/upload/v1758105162/user-circle-isolated-icon-round-600nw-2459622791_zviocb.webp'
	 * and id is 1
	 * @param username
	 * @param email
	 * @param password
	 * @author Nhut Tan
	 * @since 2025-09-17
	 * @modifies 2025-09-22
	 * @version 1.0.3
	 */
	async createUserWithUsernameEmailPasswordWithDefaultRoleAndImage(
		username: string,
		email: string,
		password: string,
		roleID: number,
		imageID: number
	): Promise<UserEntity> {
		try {
			/**
			 * Declare uuidv4() and generating default full name
			 */
			const uuid: string = uuidv4();
			const defaultName: string = `Người dùng ${uuid}`;

			return await this.dataSource.transaction(
				async (tx: EntityManager): Promise<UserEntity> => {
					/**
					 * Create user entity instance
					 */
					const user: UserEntity = tx.create(UserEntity, {
						username: username,
						email: email,
						password: password,
						fullName: defaultName,
						createdAt: new Date(),
						updatedAt: new Date(),
						role: {
							id: roleID,
						},
						userImages: [
							{
								image: {
									id: imageID,
								},
							},
						],
					});

					/**
					 * Save user to database
					 */
					return tx.save(user);
				}
			);
		} catch (e) {
			this.logger.error(
				`Error in \`createUserWithUsernameEmailPassword\`: ${(e as Error).message}`,
				(e as Error).stack
			);
			throw e;
		}
	}
	async save(user: UserEntity): Promise<UserEntity> {
		try {
			return await this.userRepository.save(user);
		} catch (e) {
			this.logger.error(`Error in \`save\`: ${(e as Error).message}`, (e as Error).stack);
			throw e;
		}
	}


}
