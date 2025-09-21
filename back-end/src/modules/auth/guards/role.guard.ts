/**
 * @description: role guard used for checking role to access controller
 * @author: Nhut Tan
 * @date: 2025-09-09
 * @modified: 2025-09-17
 * @version: 1.0.1
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';
import { AuthRequest } from '../interface/auth-request.interface';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private refector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /*
     * Getting role from meta data
     * */
    const roles: string[] = this.refector.get<string[]>(
      Roles,
      context.getHandler(),
    );

    /*
     * If role non-exist, allow access
     * */
    if (!roles) {
      return false;
    }

    /**
     * Get request and cast to `AuthRequest`
     */
    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    /**
     * Get user from request and cast to `JwtPayload`
     */
    const user: JwtPayload = request.user;

    /*
     * Check if roles include user role
     * */
    return roles.includes(user.role);
  }
}
