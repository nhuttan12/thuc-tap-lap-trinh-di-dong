/*
 * @description: role service
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { RoleEntity } from './entities/role.entity';
import { RoleStatusCode } from './status-code/role.status-code';
import { RoleResponseDto } from './dtos/role-response.dto';
import { RoleMapper } from './mappers/role.mapper';

@Injectable()
export class RoleService {
  private readonly logger: Logger = new Logger(RoleService.name);

  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleMapper: RoleMapper,
  ) {}

  async createRole(name: string): Promise<RoleEntity> {
    try {
      return await this.roleRepository.createRole(name);
    } catch (e) {
      this.logger.error(
        `Error in \`createRole\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  async getRoleByName(name: string): Promise<RoleResponseDto> {
    try {
      /*
       * Call `getRoleByName` function from repository
       * */
      const role: RoleEntity | null =
        await this.roleRepository.getRoleByName(name);
      this.logger.debug(
        `Call \`getRoleByName\` function from repository: ${JSON.stringify(role)}`,
      );

      if (!role) {
        this.logger.error(`Role with name ${name} not found`);
        throw new NotFoundException({
          statusCode: RoleStatusCode.ROLE_NOT_FOUND.statusCode,
          customCode: RoleStatusCode.ROLE_NOT_FOUND.customCode,
          message: RoleStatusCode.ROLE_NOT_FOUND.message,
        });
      }

      /*
       * Convert `RoleEntity` to `RoleResponseDto`
       * */
      const roleResponseDto: RoleResponseDto =
        this.roleMapper.toRoleResponseDto(role);
      this.logger.debug(
        `Call \`toRoleResponseDto\` function from mapper: ${JSON.stringify(roleResponseDto)}`,
      );

      /*
       * Returning `RoleResponseDto`
       * */
      return roleResponseDto;
    } catch (e) {
      this.logger.error(
        `Error in \`getRoleByName\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
