/*
 * @description: Order entity
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
import { OrderStatusEnum } from '../enums/order-status.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderDetailEntity } from './order-detail.entity';

@Entity('orders')
export class OrderEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof UserEntity => UserEntity,
    (userEntity: UserEntity): OrderEntity[] => userEntity.order,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  price: number;

  @Column()
  status: OrderStatusEnum;

  @ManyToOne(
    (): typeof OrderDetailEntity => OrderDetailEntity,
    (orderDetailEntity: OrderDetailEntity): OrderEntity =>
      orderDetailEntity.order,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  orderDetails: OrderDetailEntity[];
}
