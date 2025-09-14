/*
 * @description: Cart module
 * @author: Nhut Tan
 * @date: 2025-09-14
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartDetailEntity } from './entities/cart-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartDetailEntity])],
  providers: [],
  exports: [],
})
export class CartModule {}
