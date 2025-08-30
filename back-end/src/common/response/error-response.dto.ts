import { ResponseDto } from './response.dto';

/*
 * @description: ErrorResponseDto inherit from ResponseDto
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */
export class ErrorResponseDto<T> extends ResponseDto<T> {
  constructor(statusCode: number, message: string, data: T) {
    super(statusCode, message, data);
  }
}
