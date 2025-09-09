/*
 * @description: user mapper
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { UserEntity } from '../entities/user.entity';
import { UserResponseDto } from '../dtos/user.response.dto';

export class UserMapper {
  static toUserResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role.name,
      status: user.status.toString(),
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };
  }
}
