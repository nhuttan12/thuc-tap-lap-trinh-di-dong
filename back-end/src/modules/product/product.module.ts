/*
 * @description: Product module
 * @author: Nhut Tan
 * @date: 2025-09-14
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailsEntity } from './entities/product-details.entity';
import { CategoryModule } from '../category/category.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../orders/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductDetailsEntity]),
    CategoryModule,
    CartModule,
    OrderModule,
  ],
  exports: [],
  providers: [],
})
export class ProductModule {}
