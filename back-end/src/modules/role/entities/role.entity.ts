/*
 * @description: role entity
 * @author: Nhut Tan
 * @date: 2025-09-03
 * @modified: 2025-09-14
 * @version: 1.0.2
 * */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleStatus } from '../enums/role-status.enum';

@Entity('roles')
export class RoleEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
  })
  status: RoleStatus;

  @OneToMany(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): RoleEntity => user.role,
    {
      cascade: ['insert', 'update', 'soft-remove'],
    },
  )
  user: UserEntity[];
}
