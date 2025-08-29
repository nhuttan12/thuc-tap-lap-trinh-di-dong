export class ResponseDto<T> {
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
