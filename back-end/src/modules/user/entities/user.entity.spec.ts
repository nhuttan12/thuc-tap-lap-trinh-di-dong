/**
 * @description User entity test
 * @author Nhut Tan
 * @since 2025-10-05
 * @version 1.0.0
 */

import { UserEntity } from './user.entity';
import { UserStatus } from '../enums/user-status.enum';
import { RoleEntity } from '../../role/entities/role.entity';
import { RoleName } from '../../role/enums/role-name.enum';

describe('UserEntity', (): void => {
	it('should be defined', (): void => {
		const user = new UserEntity();

		expect(user).toBeDefined();
	});

	it('should allow assign username, password, email', (): void => {
		const user = new UserEntity();
		user.username = 'nhuttan';
		user.password = '123123';
		user.email = 'asd@gmail.com';
		user.status = UserStatus.ACTIVE;

		expect(user.username).toBe('nhuttan');
		expect(user.password).toBe('123123');
		expect(user.email).toBe('asd@gmail.com');
		expect(user.status).toBe('ACTIVE');
	});

	it('should allow assign role manual', (): void => {
		const user = new UserEntity();
		const role = new RoleEntity();

		role.id = 1;
		role.name = 'ADMIN';

		user.role = role;
		expect(user.role.name).toBe(RoleName.ADMIN);
	});
});
