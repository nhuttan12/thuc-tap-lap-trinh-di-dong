/**
 * @description Unit test for User Sign Up Request Dto class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { UserSignUpRequestDto } from './user-sign-up-request.dto';
import { validate, ValidationError } from '@nestjs/class-validator';
import { AuthStatusCode } from '../status-code/auth.status-code';

describe('UserSignUpRequestDto', (): void => {
	let dto: UserSignUpRequestDto;

	beforeEach((): void => {
		dto = new UserSignUpRequestDto();
	});

	it('should fail if username, email, password and retypePassword is empty', async (): Promise<void> => {
		dto.username = '';
		dto.password = '';
		dto.email = '';
		dto.retypePassword = '';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.isNotEmpty).toBe(
			AuthStatusCode.USERNAME_NOT_EMPTY.customCode
		);
		expect(errors[1].constraints?.isNotEmpty).toBe(
			AuthStatusCode.EMAIL_MUST_NOT_BE_EMPTY.customCode
		);
		expect(errors[2].constraints?.isNotEmpty).toBe(
			AuthStatusCode.PASSWORD_NOT_EMPTY.customCode
		);
		expect(errors[3].constraints?.isNotEmpty).toBe(
			AuthStatusCode.RETYPE_PASSWORD_NOT_EMPTY.customCode
		);
	});

	it('should fail if username contains space', async (): Promise<void> => {
		dto.username = 'nhut tan';
		dto.password = '123123';
		dto.email = 'nhut.tan@ttmobile.vn';
		dto.retypePassword = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.notContains).toBe(
			AuthStatusCode.USERNAME_NOT_CONTAINS_SPACE.customCode
		);
	});

	it('should fail if email is not valid', async (): Promise<void> => {
		dto.username = 'nhuttan';
		dto.password = '123123';
		dto.email = 'nhut.tan';
		dto.retypePassword = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0].constraints?.isEmail).toBe(
			AuthStatusCode.EMAIL_IS_NOT_VALID.customCode
		);
	});

	it('should success if username, email, password, retypePassword is valid', async (): Promise<void> => {
		dto.username = 'nhuttan';
		dto.password = '123123';
		dto.email = 'nhut.tan@ttmobile.vn';
		dto.retypePassword = '123123';

		const errors: ValidationError[] = await validate(dto);

		expect(errors.length).toBe(0);
	});
});
