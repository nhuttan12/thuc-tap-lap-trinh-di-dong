/*
 * @description: user module
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modifies: 2025-09-08
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
