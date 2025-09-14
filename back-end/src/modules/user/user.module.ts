/*
 * @description: user module
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modifies: 2025-09-14
 * @version: 1.0.2
 * */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserMapper } from './mappers/user.mapper';
import { ImageModule } from '../image/image.module';
import { UserDetailEntity } from './entities/user-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserDetailEntity]),
    forwardRef((): typeof ImageModule => ImageModule),
  ],
  providers: [UserRepository, UserService, UserMapper],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
