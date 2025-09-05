import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class CartEntity extends TimestampField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (): typeof UserEntity => UserEntity,
    (user: UserEntity): CartEntity[] => user.cart,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
