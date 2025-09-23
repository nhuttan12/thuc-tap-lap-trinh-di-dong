/**
 * @description: Catch every thing exception
 * @author: Nhut Tan
 * @date: 2025-09-14
 * @modifies: 2025-09-22
 * @version: 1.0.2
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    /**
     * Switch to HTTP arguments host
     */
    const ctx: HttpArgumentsHost = host.switchToHttp();

    let res: any = null;
    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * Get response and http status from exception
     */
    if (exception instanceof HttpException) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      res = exception.getResponse();
      httpStatus = exception.getStatus();
    }

    const isStringResponse: boolean = typeof res === 'string';

    /**
     * Create response body
     */
    const responseBody =
      !res || isStringResponse
        ? {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            message: 'Internal server error',
          }
        : {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(
              ctx.getRequest<Request>(),
            ) as string,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            message: res.customCode || res.message,
          };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
