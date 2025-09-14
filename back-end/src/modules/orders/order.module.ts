/*
 * @description: Order module
 * @author: Nhut Tan
 * @date: 2025-09-14
 * @version: 1.0.0
 * */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailEntity } from './entities/order-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderDetailEntity])],
  exports: [],
  providers: [],
})
export class OrderModule {}
