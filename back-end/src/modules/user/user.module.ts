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
import { UserMapper } from './mappers/user.mapper';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), ImageModule],
  providers: [UserRepository, UserService, UserMapper],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
