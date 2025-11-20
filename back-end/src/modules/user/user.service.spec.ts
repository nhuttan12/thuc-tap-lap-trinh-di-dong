/**
 * @description Unit Test file for testing UserService class
 * @author Nhut Tan
 * @since 2025-11-20
 * @version 1.0.0
 */

import { UserService } from './user.service';

describe('UserService', (): void => {
	let userService: UserService;

	const mockUserRepository = {
		getUserByUserNameAndPassword: jest.fn(),
		getUserByUerID: jest.fn(),
		getUserByEmail: jest.fn(),
		createNewUserGoogle: jest.fn(),
		getUserByUsername: jest.fn(),
		createUserWithUsernameEmailPassword: jest.fn(),
	};

	const mockUserMapper = {
		toUserResponseDto: jest.fn(),
	}

	const mockImageService = {
		createImage: jest.fn(),
		getImageByUrl: jest.fn(),
	}

	const mockRoleService = {
		getRoleByName: jest.fn(),
	}
});
