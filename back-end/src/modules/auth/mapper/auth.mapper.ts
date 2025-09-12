/*
 * @description: mapper class used for convert a type to `JwtPayloadInterface`
 * @author: Nhut Tan
 * @date: 2025-09-10
 * @modified: 2025-09-12
 * @version: 1.0.1
 * */

import { UserResponseDto } from '../../user/dtos/user-response.dto';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthMapper {
  toJwtPayload(user: UserResponseDto): JwtPayload {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: '',
    };
  }
}
