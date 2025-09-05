/*
 * @description: user entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modified: 2025-09-05
 * @version: 1.0.0
 * */

import {
  Column,
  Entity,
  JoinColumn, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { RoleEntity } from '../../role/entities/role.entity';
import { UserDetailEntity } from './user.detail.entity';
import { UserStatus } from '../enums/user.status.enum';
import { CartEntity } from '../../cart/entities/cart.entity';

@Entity('users')
export class UserEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ name: 'full_name' })
  fullName: string;

  @ManyToOne(
    (): typeof RoleEntity => RoleEntity,
    (role: RoleEntity): UserEntity[] => role.user,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(
    (): typeof UserDetailEntity => UserDetailEntity,
    (detail: UserDetailEntity): UserEntity => detail.user,
  )
  userDetail: UserDetailEntity;

  @OneToMany(
    (): typeof CartEntity => CartEntity,
    (cart: CartEntity): number => cart.user,
  )
  cart: CartEntity[];
}
