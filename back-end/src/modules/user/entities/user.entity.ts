/*
 * @description: user entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modified: 2025-09-14
 * @version: 1.0.2
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
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(
    (): typeof UserDetailEntity => UserDetailEntity,
    (detail: UserDetailEntity): UserEntity => detail.user,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  userDetail: UserDetailEntity;

  @OneToMany(
    (): typeof CartEntity => CartEntity,
    (cart: CartEntity): UserEntity => cart.user,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  cart: CartEntity[];

  @OneToMany(
    (): typeof OrderEntity => OrderEntity,
    (order: OrderEntity): UserEntity => order.user,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  order: OrderEntity[];

  @OneToMany(
    (): typeof UserImageEntity => UserImageEntity,
    (userImage: UserImageEntity): UserEntity => userImage.user,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  userImages: UserImageEntity[];
}
