import {
  Column,
  Entity,
  JoinColumn, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ImageEntity } from '../../image/entities/image.entity';
import { ProductStatusEnum } from '../enums/product.status.enum';
import { ProductDetailsEntity } from './product.details.entity';

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

  @OneToMany(
    (): typeof ImageEntity => ImageEntity,
    (image: ImageEntity): number => image,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'image_id' })
  image: ImageEntity;

  @OneToOne(
    (): typeof ProductDetailsEntity => ProductDetailsEntity,
    (productDetailsEntity: ProductDetailsEntity): ProductEntity =>
      productDetailsEntity.productEntity,
    {
      eager: true,
    },
  )
  productDetailsEntity: ProductDetailsEntity;
}
