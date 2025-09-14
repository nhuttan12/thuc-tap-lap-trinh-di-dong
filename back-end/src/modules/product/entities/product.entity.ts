/*
 * @description: Product entity
 * @author: Nhut Tan
 * @date: 2025-09-06
 * @modified: 2025-09-14
 * @version: 1.0.3
 * */

import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductStatusEnum } from '../enums/product-status.enum';
import { ProductDetailsEntity } from './product-details.entity';
import { CartDetailEntity } from '../../cart/entities/cart-detail.entity';
import { OrderDetailEntity } from '../../orders/entities/order-detail.entity';
import { ProductImageEntity } from '../../image/entities/product-image.entity';

@Entity('products')
export class ProductEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column({
    type: 'enum',
    enum: ProductStatusEnum,
    default: ProductStatusEnum.ACTIVE,
    nullable: false,
  })
  status: ProductStatusEnum;

  @OneToOne(
    (): typeof ProductDetailsEntity => ProductDetailsEntity,
    (productDetailsEntity: ProductDetailsEntity): ProductEntity =>
      productDetailsEntity.productEntity,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  productDetailsEntity: ProductDetailsEntity;

  @OneToMany(
    (): typeof CartDetailEntity => CartDetailEntity,
    (cartDetail: CartDetailEntity): ProductEntity => cartDetail.product,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  cartDetail: CartDetailEntity[];

  @OneToMany(
    (): typeof OrderDetailEntity => OrderDetailEntity,
    (orderDetail: OrderDetailEntity): ProductEntity => orderDetail.product,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  orderDetails: OrderDetailEntity[];

  @OneToMany(
    (): typeof ProductImageEntity => ProductImageEntity,
    (productImage: ProductImageEntity): ProductEntity => productImage.product,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  productImages: ProductImageEntity[];
}
