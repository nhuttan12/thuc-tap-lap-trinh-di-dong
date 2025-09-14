/*
 * @description: Product detail entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './repositories/role.repository';
import { RoleMapper } from './mappers/role.mapper';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleRepository, RoleMapper, RoleService],
  controllers: [],
  exports: [RoleService],
})
export class RoleModule {}
