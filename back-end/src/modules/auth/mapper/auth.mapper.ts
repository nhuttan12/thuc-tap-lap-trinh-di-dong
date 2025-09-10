/*
 * @description: mapper class used for convert a type to `JwtPayloadInterface`
 * @author: Nhut Tan
 * @date: 2025-09-10
 * @version: 1.0.0
 * */

import { UserResponseDto } from '../../user/dtos/user.response.dto';
import { JwtPayloadInterface } from '../interface/jwt.payload.interface';

export class AuthMapper {
  static toJwtPayload(user: UserResponseDto): JwtPayloadInterface {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      accessToken: '',
    };
  }
}
