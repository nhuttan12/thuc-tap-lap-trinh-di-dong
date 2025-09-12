/*
 * @description: image module
 * @author: Nhut Tan
 * @date: 2025-09-11
 * @version: 1.0.1
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { ImageService } from './image.service';
import { ImageMapper } from './mappers/image.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [UserRepository, ImageService, ImageMapper],
  exports: [ImageService],
})
export class ImageModule {}
