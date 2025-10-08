import { AuthStatusCode } from './auth.status-code';

describe('AuthStatusCode', (): void => {
	it('should create USERNAME_MUST_BE_STRING with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.USERNAME_MUST_BE_STRING;
		expect(code.message).toBe('Username must be a string');
		expect(code.customCode).toBe('ATH_001');
		expect(code.statusCode).toBe(400);
	});

	it('should create USERNAME_NOT_EMPTY with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.USERNAME_NOT_EMPTY;
		expect(code.message).toBe('Username must not be empty');
		expect(code.customCode).toBe('ATH_002');
		expect(code.statusCode).toBe(400);
	});

	it('should create PASSWORD_NOT_EMPTY with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.PASSWORD_NOT_EMPTY;
		expect(code.message).toBe('Password must not be empty');
		expect(code.customCode).toBe('ATH_003');
		expect(code.statusCode).toBe(400);
	});

	it('should create USERNAME_NOT_CONTAINS_SPACE with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.USERNAME_NOT_CONTAINS_SPACE;
		expect(code.message).toBe('Username must not contain space');
		expect(code.customCode).toBe('ATH_004');
		expect(code.statusCode).toBe(400);
	});

	it('should create EMAIL_ALREADY_EXISTS with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.EMAIL_ALREADY_EXISTS;
		expect(code.message).toBe('Email already exists');
		expect(code.customCode).toBe('ATH_005');
		expect(code.statusCode).toBe(409);
	});

	it('should create PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME with correct values', (): void => {
		const code: AuthStatusCode =
			AuthStatusCode.PASSWORD_AND_RETYPE_PASSWORD_ARE_NOT_THE_SAME;
		expect(code.message).toBe(
			'Password and retype password are not the same'
		);
		expect(code.customCode).toBe('ATH_006');
		expect(code.statusCode).toBe(400);
	});

	it('should create EMAIL_IS_NOT_VALID with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.EMAIL_IS_NOT_VALID;
		expect(code.message).toBe('Email is not valid');
		expect(code.customCode).toBe('ATH_007');
		expect(code.statusCode).toBe(400);
	});

	it('should create EMAIL_MUST_NOT_BE_EMPTY with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.EMAIL_MUST_NOT_BE_EMPTY;
		expect(code.message).toBe('Email must not be empty');
		expect(code.customCode).toBe('ATH_008');
		expect(code.statusCode).toBe(400);
	});

	it('should create RETYPE_PASSWORD_NOT_EMPTY with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.RETYPE_PASSWORD_NOT_EMPTY;
		expect(code.message).toBe('Retype password must not be empty');
		expect(code.customCode).toBe('ATH_009');
		expect(code.statusCode).toBe(400);
	});

	it('should create USER_ALREADY_EXISTS with correct values', (): void => {
		const code: AuthStatusCode = AuthStatusCode.USER_ALREADY_EXISTS;
		expect(code.message).toBe('User already exists');
		expect(code.customCode).toBe('ATH_010');
		expect(code.statusCode).toBe(409);
	});
});
