/**
 * @description param decorator used for getting user by request
 * @author Nhut Tan
 * @date 2025-09-24
 * @version 1.0.0
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../auth/interface/auth-request.interface';

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request: AuthRequest = ctx.switchToHttp().getRequest();
		return request.user;
	}
);
