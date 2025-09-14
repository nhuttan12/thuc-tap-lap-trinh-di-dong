/*
 * @description: image module
 * @author: Nhut Tan
 * @date: 2025-09-11
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ImageService } from './image.service';
import { ImageMapper } from './mappers/image.mapper';
import { ImageRepository } from './repositories/image.repository';
import { ProductImageEntity } from './entities/product-image.entity';
import { UserImageEntity } from './entities/user-image.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImageEntity,
      ProductImageEntity,
      UserImageEntity,
    ]),
    ProductModule,
    forwardRef((): typeof UserModule => UserModule),
  ],
  providers: [ImageService, ImageMapper, ImageRepository],
  exports: [ImageService],
})
export class ImageModule {}
