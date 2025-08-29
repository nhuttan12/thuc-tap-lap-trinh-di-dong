import { ResponseDto } from './response.dto';

export class ErrorResponseDto<T> extends ResponseDto<T> {
  constructor(statusCode: number, message: string, data: T) {
    super(statusCode, message, data);
  }
}
