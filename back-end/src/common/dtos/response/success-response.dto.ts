/*
 * @description: SuccessResponseDto inherit from ResponseDto
 * @author: Nhut Tan
 * @date: 2025-08-30
 */

import { ResponseDto } from './response.dto';

export class SuccessResponseDto<T> extends ResponseDto<T> {
  constructor(statusCode: number, message: string, data: T) {
    super(statusCode, message, data);
  }
}
