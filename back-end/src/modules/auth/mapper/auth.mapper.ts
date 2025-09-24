/*
 * @description mapper class used for convert a type to `JwtPayloadInterface`
 * @author Nhut Tan
 * @since 2025-09-10
 * @modifies 2025-09-12
 * @version 1.0.1
 */

import { UserEntityResponseDto } from '../../user/dtos/user-entity-response.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthMapper {
  toJwtPayload(user: UserEntityResponseDto): JwtPayload {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: '',
    };
  }
}
