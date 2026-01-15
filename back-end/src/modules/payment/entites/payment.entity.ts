/**
 * @description Payment entity
 * @author Vo Tan Tai
 * @since 2026-01-03
 * @version 1.0.0
 */

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { PaymentStatusEnum } from '../enums/payment-status.enum';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { OrderEntity } from '../../orders/entities/order.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'payments' })
export class PaymentEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'amount',
		type: 'decimal',
		precision: 12,
		scale: 2,
		nullable: true,
	})
	amount: number;

	@Column({
		name: 'currency',
		type: 'varchar',
		length: '3',
		nullable: false,
		default: 'VND',
	})
	currency: string;

	@Column({
		name: 'status',
		type: 'enum',
		enum: PaymentStatusEnum,
		default: PaymentStatusEnum.PENDING,
	})
	status: PaymentStatusEnum;

	@Column({
		name: 'payment_method',
		type: 'enum',
		enum: PaymentMethodEnum,
		nullable: false,
	})
	paymentMethod: PaymentMethodEnum;

	@Column({
		name: 'transaction_id',
		type: 'varchar',
		nullable: true,
	})
	transactionID: string;

	@ManyToOne((): typeof OrderEntity => OrderEntity)
	@JoinColumn({
		name: 'order_id',
		foreignKeyConstraintName:
			'fk_order_id_column_reference_to_id_in_orders_table',
		referencedColumnName: 'id',
	})
	order: OrderEntity;

	@ManyToOne((): typeof UserEntity => UserEntity)
	@JoinColumn({
		name: 'user_id',
		foreignKeyConstraintName:
			'fk_user_id_column_reference_to_id_in_users_table',
		referencedColumnName: 'id',
	})
	user: UserEntity;
}
