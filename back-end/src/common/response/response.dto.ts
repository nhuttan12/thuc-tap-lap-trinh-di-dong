/*
 * @description: ResponseDto
 * @author: Nhut Tan
 * @date: 2025-08-30
 * */

export class ResponseDto<T> {
  /*
   * statusCode: status code of response
   * */
  statusCode: number;

  /*
   * message: message of response
   * */
  message: string;

  /*
   * data: data of response
   * */
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
