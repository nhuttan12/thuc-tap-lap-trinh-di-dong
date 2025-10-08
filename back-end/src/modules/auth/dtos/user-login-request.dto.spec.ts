/**
 * @description Unit test for User Login Request Dto class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { UserLoginRequestDto } from './user-login-request.dto';
import { validate, ValidationError } from '@nestjs/class-validator';
import { AuthStatusCode } from '../status-code/auth.status-code';

describe('UserLoginRequestDto', (): void => {
	let dto: UserLoginRequestDto;

	beforeEach(() => {
		dto = new UserLoginRequestDto();
	});

	it('should fail if username and password is empty', async (): Promise<void> => {
		dto.username = '';
		dto.password = '';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.isNotEmpty).toBe(
			AuthStatusCode.USERNAME_NOT_EMPTY.customCode
		);
		expect(errors[1].constraints?.isNotEmpty).toBe(
			AuthStatusCode.PASSWORD_NOT_EMPTY.customCode
		);
	});

	it('should username is not a string', async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.username = 123 as any;
		dto.password = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.isString).toBe(
			AuthStatusCode.USERNAME_MUST_BE_STRING.customCode
		);
	});

	it('should fail if username contains space', async (): Promise<void> => {
		dto.username = 'nhut tan';
		dto.password = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.notContains).toBe(
			AuthStatusCode.USERNAME_NOT_CONTAINS_SPACE.customCode
		);
	});

	it('should work if username and password valid', async () => {
		dto.username = 'nhuttan';
		dto.password = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBe(0);
	});
});
