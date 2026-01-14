/**
 * @description optional jwt auth guard, if no token, still pass
 * @author @nhuttan12
 * @since 2026-01-14
 * @version 1.0.0
 */

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
	handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
		// Không token → user = null → cho qua
		if (info?.name === 'JsonWebTokenError') {
			throw err;
		}

		if (info?.name === 'TokenExpiredError') {
			throw err;
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return user ?? null;
	}
}
