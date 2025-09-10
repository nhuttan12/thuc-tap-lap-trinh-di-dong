/*
 * @description: Image entity
 * @author: Nhut Tan
 * @date: 2025-09-06
 * @modified: 2025-09-07
 * @version: 1.0.1
 * */

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ImageStatusEnum } from '../enums/image.status.enum';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductImageEntity } from './product.image.entity';
import { UserImageEntity } from './user.image.entity';

@Entity('images')
export class ImageEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ImageStatusEnum,
    nullable: false,
  })
  status: ImageStatusEnum;

  @OneToOne(
    (): typeof ProductImageEntity => ProductImageEntity,
    (productImageEntity: ProductImageEntity): ImageEntity =>
      productImageEntity.image,
    {
      eager: true,
    },
  )
  productImage: ProductImageEntity;

  @OneToOne(
    (): typeof UserImageEntity => UserImageEntity,
    (userImageEntity: UserImageEntity): ImageEntity => userImageEntity.image,
    {
      eager: true,
    },
  )
  userImage: UserImageEntity;
}
