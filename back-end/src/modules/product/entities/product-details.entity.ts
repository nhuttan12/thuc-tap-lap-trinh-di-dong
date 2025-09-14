/*
 * @description: Product detail entity
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
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../category/entities/category.entity';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductEntity } from './product.entity';

@Entity()
export class ProductDetailsEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column()
  description: string;

  @ManyToOne(
    (): typeof CategoryEntity => CategoryEntity,
    (categoryEntity: CategoryEntity): ProductDetailsEntity[] =>
      categoryEntity.productDetails,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'category_id' })
  categoryEntity: CategoryEntity;

  @OneToOne(
    (): typeof ProductEntity => ProductEntity,
    (productEntity: ProductEntity): ProductDetailsEntity =>
      productEntity.productDetailsEntity,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'id' })
  productEntity: ProductEntity;
}
