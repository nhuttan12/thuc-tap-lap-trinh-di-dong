import { BadRequestException } from '@nestjs/common';
import { AuthStatusCode } from '../status-code/auth.status-code';
import {
	UserLoginRequestDto,
} from './user-login-request.dto';
/**
 * @description Unit test for User Login Request Dto class
 * @author Nhut Tan
 * @since 2025-10-05
 * @version 1.0.0
 */

describe('UserLoginRequestDto', (): void => {
	/**
	 * @description Testing dto class define
	 */
	it('should be defined', () => {
		const userLoginRequestDto = new UserLoginRequestDto();

		expect(userLoginRequestDto).toBeDefined();
	});

	it('should throw error not string', () => {
		const userLoginRequestDto = new UserLoginRequestDto();

    // eslint-disable-next-line
		userLoginRequestDto.username = 123123;
		userLoginRequestDto.password = '123123';

		expect(userLoginRequestDto).rejects.toThrowError(BadRequestException);

		expect(userLoginRequestDto).rejects.toMatchObject({
      response: { AuthStatusCode.USERNAME_MUST_BE_STRING.customCode, }
    });
	});
});
