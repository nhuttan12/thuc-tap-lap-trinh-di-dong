/**
 * @description Product module
 * @author Nhut Tan
 * @since 2025-09-14
 * @modifies 2025-09-24
 * @version 1.0.2
 */

import { Module } from '@nestjs/common';
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

@Module({
	imports: [
		TypeOrmModule.forFeature([ProductEntity, ProductDetailsEntity]),
		CategoryModule,
		CartModule,
		OrderModule,
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
