/*
 * @description: User detail entity
 * @author: Nhut Tan
 * @date: 2025-09-05
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import { TimestampField } from '../../../common/database/timestamp.field';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class UserDetailEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  address3: string;

  @OneToOne(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): UserDetailEntity => user.userDetail,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  @JoinColumn({ name: 'id' })
  user: UserEntity;
}
