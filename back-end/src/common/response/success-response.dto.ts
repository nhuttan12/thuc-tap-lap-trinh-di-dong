import { ResponseDto } from './response.dto';

export class SuccessResponseDto<T> extends ResponseDto<T> {
  constructor(statusCode: number, message: string, data: T) {
    super(statusCode, message, data);
  }
}
