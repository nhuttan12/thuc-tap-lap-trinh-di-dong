/*
 * @description user status code
 * @author Nhut Tan
 * @since 2025-09-08
 * @modifies 2025-09-12
 * @version 1.0.1
 */

import { HttpStatus } from '@nestjs/common'
import { BaseStatusCode } from '../../../common/dtos/status-code/base.status-code'

export class UserStatusCode extends BaseStatusCode {
	static readonly USER_NOT_FOUND: UserStatusCode = new UserStatusCode(
		HttpStatus.NOT_FOUND,
		'USR_001',
		'User not found'
	)
	static readonly USER_BANNED: UserStatusCode = new UserStatusCode(
		HttpStatus.FORBIDDEN,
		'USR_002',
		'User banned'
	)
}
