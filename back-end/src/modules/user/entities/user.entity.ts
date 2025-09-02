import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { RoleEntity } from '../../role/entities/role.entity';
import { UserDetailEntity } from './user.detail.entity';

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

  @OneToOne(
    (): typeof RoleEntity => RoleEntity,
    (role: RoleEntity): number => role.id,
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
}
