/*
 * @description: Cart entity
 * @author: Nhut Tan
 * @date: 2025-09-06
 * @modified: 2025-09-07
 * @version: 1.0.1
 * */

import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { UserEntity } from '../../user/entities/user.entity';
import { CartDetailEntity } from './cart.detail.entity';

@Entity('carts')
export class CartEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): CartEntity[] => user.cart,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    (): typeof CartDetailEntity => CartDetailEntity,
    (cartDetail: CartDetailEntity): CartEntity => cartDetail.cart,
    {
      eager: true,
    },
  )
  cartDetail: CartDetailEntity[];
}
