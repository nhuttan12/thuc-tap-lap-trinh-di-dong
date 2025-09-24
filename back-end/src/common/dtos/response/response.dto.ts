/**
 * @description ResponseDto
 * @author Nhut Tan
 * @since 2025-08-30
 * @modifies 2025-09-17
 * @version 1.0.1
 */

export class ResponseDto<T> {
  /*
   * statusCode: status code of response
   * */
  statusCode: string;

  /*
   * message: message of response
   * */
  message: string;

  /*
   * data: data of response
   * */
  data: T;

  constructor(statusCode: string, message: string, data: T) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
