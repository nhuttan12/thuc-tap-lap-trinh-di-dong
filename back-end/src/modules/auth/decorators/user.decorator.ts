/*
 * @description: param decorator used for getting user by request
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @version: 1.0.0
 * */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../interface/auth-request.interface';
import { JwtPayload } from '../interface/jwt-payload.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request: AuthRequest = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
