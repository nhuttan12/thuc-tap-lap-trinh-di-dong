/*
 * @description: Product detail entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [],
  controllers: [],
})
export class RoleModule {}
