/*
 * @description: Cart detail entity
 * @author: Nhut Tan
 * @date: 2025-09-07
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { CartEntity } from './cart.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity('cart_details')
export class CartDetailEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof CartEntity => CartEntity,
    (cart: CartEntity): CartDetailEntity[] => cart.cartDetail,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

  @ManyToOne(
    (): typeof ProductEntity => ProductEntity,
    (productEntity: ProductEntity): CartDetailEntity[] =>
      productEntity.cartDetail,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'cart_id' })
  product: ProductEntity;
}
