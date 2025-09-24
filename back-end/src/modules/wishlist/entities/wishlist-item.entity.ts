/**
 * @description Wishlist item entity
 * @author Nhut Tan
 * @since 2025-09-23
 * @version 1.0.0
 */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { ProductEntity } from '../../product/entities/product.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { WishlistStatusEnum } from '../enums/wishlist-status.enum';

@Entity('wishlist_items')
export class WishlistItemEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    (): typeof ProductEntity => ProductEntity,
    (product: ProductEntity): WishlistItemEntity => product.wishlistItem,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): WishlistItemEntity[] => user.wishlistItems,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'enum',
    enumName: 'wishlist_items_status_enum',
    default: WishlistStatusEnum.ACTIVE,
    nullable: false,
  })
  status: WishlistStatusEnum;
}
