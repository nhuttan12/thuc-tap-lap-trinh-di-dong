import { TimestampField } from '../../../common/database/timestamp.field';
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

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
    (user: UserEntity): number => user.id,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'id' })
  user: UserEntity;
}
