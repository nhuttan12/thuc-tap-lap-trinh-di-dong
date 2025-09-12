/*
 * @description: Order detail entity
 * @author: Nhut Tan
 * @date: 2025-09-05
 * @modified: 2025-09-12
 * @version: 1.0.1
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
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(
    (): typeof ProductEntity => ProductEntity,
    (productEntity: ProductEntity): OrderDetailEntity[] =>
      productEntity.orderDetails,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
