import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('roles')
export class RoleEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): RoleEntity => user.role,
    {
      eager: true,
    },
  )
  user: UserEntity[];
}
