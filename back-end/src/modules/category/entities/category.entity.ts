import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryStatusEnum } from '../enums/category.status.enum';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductDetailsEntity } from '../../product/entities/product.details.entity';

@Entity('categories')
export class CategoryEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryStatusEnum,
    default: CategoryStatusEnum.ACTIVE,
    nullable: false,
  })
  status: CategoryStatusEnum;

  @OneToMany(
    (): typeof ProductDetailsEntity => ProductDetailsEntity,
    (productDetailsEntity: ProductDetailsEntity): CategoryEntity =>
      productDetailsEntity.categoryEntity,
  )
  productDetails: ProductDetailsEntity[];
}
