/**
 * @description SuccessResponseDto inherit from ResponseDto
 * @author Nhut Tan
 * @since 2025-08-30
 * @modifies 2025-09-17
 * @version 1.0.1
 */

import { ResponseDto } from './response.dto'

export class SuccessResponseDto<T> extends ResponseDto<T> {
	constructor(statusCode: string, message: string, data: T) {
		super(statusCode, message, data)
	}
}
