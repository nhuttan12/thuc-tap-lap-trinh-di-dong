/**
 * @description Catch every thing exception
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-09-22
 * @version 1.0.2
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

        /**
         * Get deffault request and response
         */
        const request = ctx.getRequest<Request>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = ctx.getResponse();

        /**
         * Get deffault status and message
         */
        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string = 'Internal server error';

        /**
         * Get response and http status from exception
         */
        if (exception instanceof HttpException) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
            const res = exception.getResponse();
            status = exception.getStatus();


            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                message = (res as any).message ?? message;
            }
        } else {
            console.error('Unhandled exception:', exception);
        }

        /**
         * Create response body
         */
        httpAdapter.reply(
            response,
            {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message,
            },
            status
        );
	}
}
