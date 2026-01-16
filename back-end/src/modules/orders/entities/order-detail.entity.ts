import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/entities/product.entity';

@Entity('order_details')
export class OrderDetailEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(
		() => OrderEntity,
		(order) => order.orderDetails,
		{
			cascade: ['insert', 'update', 'soft-remove'],
			onDelete: 'CASCADE',
		}
	)
	@JoinColumn({ name: 'order_id' })
	order: OrderEntity;

	@ManyToOne(
		() => ProductEntity,
		(product) => product.orderDetails,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'product_id' })
	product: ProductEntity;

	@Column()
	quantity: number;

	@Column()
	price: number;
}