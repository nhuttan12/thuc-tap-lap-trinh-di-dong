/*
 * @description: Order detail entity
 * @author: Nhut Tan
 * @date: 2025-09-05
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity('order_details')
export class OrderDetailEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof OrderEntity => OrderEntity,
    (orderEntity: OrderEntity): OrderDetailEntity[] => orderEntity.orderDetails,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(
    (): typeof ProductEntity => ProductEntity,
    (productEntity: ProductEntity): OrderDetailEntity[] =>
      productEntity.orderDetails,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
