/**
 * @description Product module
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-09-24
 * @version 1.0.2
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailsEntity } from './entities/product-details.entity';
import { CategoryModule } from '../category/category.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../orders/order.module';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './product.service';
import { ProductMapper } from './mappers/product.mapper';
import { ProductController } from './product.controller';
import { HelperModule } from '../../common/helper/helper.module';
import { ProductDetailRepository } from './repositories/product-detail.repository';
import { ProductDetailMapper } from './mappers/product-detail.mapper';
import { ProductDetailService } from './product-detail.service';
import {CategoryEntity} from "../category/entities/category.entity";
import {ImageEntity} from "../image/entities/image.entity";
import {ProductImageEntity} from "../image/entities/product-image.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductEntity, ProductDetailsEntity,
			CategoryEntity,
			ImageEntity,
			ProductImageEntity,
		]),
		CategoryModule,
		forwardRef(() => CartModule),
		forwardRef(() => OrderModule),
		HelperModule,
	],
	providers: [
		ProductRepository,
		ProductDetailRepository,
		ProductService,
		ProductDetailService,
		ProductMapper,
		ProductDetailMapper,
	],
	exports: [ProductService],
	controllers: [ProductController],
})
export class ProductModule {}