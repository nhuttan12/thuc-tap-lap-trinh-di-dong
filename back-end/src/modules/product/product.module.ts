/**
 * @description Product module
 * @author Nhut Tan
 * @since 2025-09-14
 * @modified: 2025-09-15
 * @version 1.0.1
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

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductDetailsEntity]),
    CategoryModule,
    CartModule,
    OrderModule,
    HelperModule,
  ],
  providers: [ProductRepository, ProductService, ProductMapper],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
