import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { UserEntity } from '../../user/entities/user.entity';
import { OrderDetailEntity } from './order-detail.entity';

@Entity('orders')
export class OrderEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => UserEntity,
		(user) => user.order,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@Column()
	price: number;

	@Column({
		type: 'enum',
		enum: OrderStatusEnum,
		default: OrderStatusEnum.ACTIVE,
	})
	status: OrderStatusEnum;

	@OneToMany(
		() => OrderDetailEntity,
		(orderDetail) => orderDetail.order,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	orderDetails: OrderDetailEntity[];
}