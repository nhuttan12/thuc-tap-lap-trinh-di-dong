/*
 * @description: base status code, use for other class to extends
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

export class BaseStatusCode {
  public constructor(
    public readonly statusCode: number,
    public readonly customCode: string,
    public readonly message: string,
  ) {}
}
