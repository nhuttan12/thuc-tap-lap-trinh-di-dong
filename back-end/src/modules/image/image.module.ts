/*
 * @description image module
 * @author Nhut Tan
 * @since 2025-09-11
 * @modifies 2025-09-14
 * @version 1.0.2
 */

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
import { CloudinaryProvider } from '../../common/config/cloudinany/cloudanary.provider';

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
	providers: [ImageService, ImageMapper, ImageRepository,CloudinaryProvider],
	exports: [ImageService, CloudinaryProvider],
})
export class ImageModule {}
