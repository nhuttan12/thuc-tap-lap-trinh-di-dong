/*
 * @description: user entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modified: 2025-09-12
 * @version: 1.0.1
 * */

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { RoleEntity } from '../../role/entities/role.entity';
import { UserDetailEntity } from './user-detail.entity';
import { UserStatus } from '../enums/user-status.enum';
import { CartEntity } from '../../cart/entities/cart.entity';
import { OrderEntity } from '../../orders/entities/order.entity';
import { UserImageEntity } from '../../image/entities/user-image.entity';

@Entity('users')
export class UserEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ManyToOne(
    (): typeof RoleEntity => RoleEntity,
    (role: RoleEntity): UserEntity[] => role.user,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(
    (): typeof UserDetailEntity => UserDetailEntity,
    (detail: UserDetailEntity): UserEntity => detail.user,
    {
      eager: true,
      cascade: true,
    },
  )
  userDetail: UserDetailEntity;

  @OneToMany(
    (): typeof CartEntity => CartEntity,
    (cart: CartEntity): UserEntity => cart.user,
    {
      eager: true,
      cascade: true,
    },
  )
  cart: CartEntity[];

  @OneToMany(
    (): typeof OrderEntity => OrderEntity,
    (order: OrderEntity): UserEntity => order.user,
    {
      eager: true,
      cascade: true,
    },
  )
  order: OrderEntity[];

  @OneToMany(
    (): typeof UserImageEntity => UserImageEntity,
    (userImage: UserImageEntity): UserEntity => userImage.user,
    {
      eager: true,
      cascade: true,
    },
  )
  userImages: UserImageEntity[];
}
