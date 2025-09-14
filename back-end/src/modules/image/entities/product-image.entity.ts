/*
 * @description: Product image entity
 * @author: Nhut Tan
 * @date: 2025-09-07
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ImageEntity } from './image.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { ProductImageTypeEnum } from '../../product/enums/product-image.type.enum';

@Entity('product_images')
export class ProductImageEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    (): typeof ImageEntity => ImageEntity,
    (imageEntity: ImageEntity): ProductImageEntity => imageEntity.productImage,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  @ManyToOne(
    (): typeof ProductEntity => ProductEntity,
    (productEntity: ProductEntity): ProductImageEntity[] =>
      productEntity.productImages,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({
    type: 'enum',
    enum: ProductImageTypeEnum,
    nullable: false,
  })
  type: ProductImageTypeEnum;
}
