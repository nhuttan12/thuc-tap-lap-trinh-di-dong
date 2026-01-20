/**
 * @description param decorator used for getting user by request, if not exist,
 * return null
 * @author @nhuttan12
 * @since 2026-01-14
 * @version 1.0.0
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';
import { AuthRequest } from '../../auth/interface/auth-request.interface';

export const UserOptional = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): JwtPayload | null => {
		const request: AuthRequest = ctx.switchToHttp().getRequest();
		return request.user;
	}
);
