/*
 * @description: user entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [],
  controllers: [],
})
export class UserModule {}
