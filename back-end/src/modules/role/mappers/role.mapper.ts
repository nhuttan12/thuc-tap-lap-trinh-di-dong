/*
 * @description: role mapper
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { Injectable } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { RoleResponseDto } from '../dtos/role-response.dto';

@Injectable()
export class RoleMapper {
  /*
   * @description: function to convert `RoleEntity` to `RoleResponseDto`
   * @author: Nhut Tan
   * @date: 2025-09-13
   * @version: 1.0.0
   * */
  toRoleResponseDto(role: RoleEntity): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      status: role.status.toString(),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
