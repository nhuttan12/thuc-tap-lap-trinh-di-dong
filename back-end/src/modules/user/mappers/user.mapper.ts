/*
 * @description: user mapper
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @modified: 2025-09-12
 * @version: 1.0.1
 * */

import { UserEntity } from '../entities/user.entity';
import { UserEntityResponseDto } from '../dtos/user-entity-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  toUserResponseDto(user: UserEntity): UserEntityResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      status: user.status.toString(),
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };
  }
}
