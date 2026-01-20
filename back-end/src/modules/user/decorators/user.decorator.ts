/**
 * @description param decorator used for getting user by request
 * @author Nhut Tan
 * @date 2025-09-24
 * @modifies 2026-01-14
 * @version 1.0.1
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../auth/interface/auth-request.interface';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): JwtPayload => {
		const request: AuthRequest = ctx.switchToHttp().getRequest();
		return request.user;
	}
);
