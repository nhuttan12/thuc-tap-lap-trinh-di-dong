/**
 * @description MessageResponseDto inherit from ResponseDto
 * @author Vo Tan Tai
 * @since 2025-11-19
 * @version 1.0.0
 */
import { ResponseDto } from './response.dto';

export class MessageResponseDto<T> extends ResponseDto<null> {
	constructor(statusCode: string, message: string) {
		super(statusCode, message, null);
	}
}
