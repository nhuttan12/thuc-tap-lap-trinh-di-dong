/**
 * @description Unit Test file for testing User Entity Response DTO class
 * @author Nhut Tan
 * @since 2025-10-05
 * @version 1.0.0
 */

import { UserEntityResponseDto } from './user-entity-response.dto';

describe('UserEntityResponseDto', () => {
	it('should be defined', (): void => {
		const userEntityResponseDto = new UserEntityResponseDto();
		expect(userEntityResponseDto).toBeDefined();
	});
});
