import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ImageTypeEnum } from '../enums/image.type.enum';
import { ImageStatusEnum } from '../enums/image.status.enum';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductEntity } from '../../product/entities/product.entity';

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
    enum: ImageTypeEnum,
    nullable: false,
  })
  type: ImageTypeEnum;

  @Column({
    type: 'enum',
    enum: ImageStatusEnum,
    nullable: false,
  })
  status: ImageStatusEnum;

  // @ManyToOne(
  //   (): typeof ProductEntity => ProductEntity,
  //   (productEntity: ProductEntity): ImageEntity[] => productEntity.image,)
  //
}
