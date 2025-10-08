/**
 * @description Unit Test file for testing Auth Mapper class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { AuthMapper } from './auth.mapper';
import { UserEntityResponseDto } from '../../user/dtos/user-entity-response.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';

describe('AuthMapper', (): void => {
	let authMapper: AuthMapper;

	/**
	 * @description Setup AuthMapper instance before each test
	 */
	beforeEach((): void => {
		authMapper = new AuthMapper();
	});

	/**
	 * @description Create mocking variable
	 */
	const user: UserEntityResponseDto = {
		id: 1,
		username: 'nhuttan',
		email: 'nhuttan@gmail.com',
		role: 'CUSTOMER',
		status: 'ACTIVE',
		createdAt: new Date().toString(),
		updatedAt: new Date().toString(),
	};

	const payload: JwtPayload = {
		id: 1,
		email: 'nhuttan@gmail.com',
		role: 'CUSTOMER',
		accessToken: '',
	};

	/**
	 * @description Test toJwtPayload function mapping UserResponse to JwtPayload
	 */
	it('should mapping user response to jwt payload', (): void => {
		const result: JwtPayload = authMapper.toJwtPayload(user);

		expect(result).toEqual(payload);
	});

	/**
	 * @description Test toJwtPayload function not mutate the original user object
	 */
	it('should not mutate the original user object', () => {
		const originalCopy = { ...user };

		authMapper.toJwtPayload(user);

		expect(user).toEqual(originalCopy);
	});

	/**
	 * @description Test toJwtPayload function access token empty by default
	 */
	it('should access token empty by default', () => {
		const result: JwtPayload = authMapper.toJwtPayload(user);

		expect(result.accessToken).toEqual('');
	});
});
