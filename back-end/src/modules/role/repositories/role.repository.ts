/*
 * @description: role repository
 * @author: Nhut Tan
 * @date: 2025-09-13
 * @version: 1.0.0
 * */

import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { RoleStatus } from '../enums/role-status.enum';

export class RoleRepository {
  private readonly logger: Logger = new Logger(RoleRepository.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /*
   * @description: Create new role in database
   * @author: Nhut Tan
   * @date: 2025-09-13
   * @version: 1.0.0
   * */
  async createRole(name: string): Promise<RoleEntity> {
    try {
      return await this.dataSource.transaction(
        async (tx: EntityManager): Promise<RoleEntity> => {
          /*
           * Create role entity instance to insert to database
           * */
          const roleEntity: RoleEntity = tx.create(RoleEntity, {
            name,
            status: RoleStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          this.logger.debug(`Created role: ${JSON.stringify(roleEntity)}`);

          /*
           * Save role entity instance to database
           * */
          return await tx.save(roleEntity);
        },
      );
    } catch (e) {
      this.logger.error(
        `Error in \`createRole\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /*
   * @description: Get role by name in the database
   * @author: Nhut Tan
   * @date: 2025-09-13
   * @version: 1.0.0
   * */
  async getRoleByName(name: string): Promise<RoleEntity | null> {
    try {
      return await this.roleRepository.findOne({
        where: {
          name: name,
        },
      });
    } catch (e) {
      this.logger.error(
        `Error in \`getRoleByName\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
