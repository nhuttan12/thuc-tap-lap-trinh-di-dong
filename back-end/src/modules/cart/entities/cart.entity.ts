/*
 * @description Cart entity
 * @author Nhut Tan
 * @since 2025-09-06
 * @modifies 2025-09-14
 * @version 1.0.3
 */

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { TimestampField } from '../../../common/database/timestamp.field'
import { UserEntity } from '../../user/entities/user.entity'
import { CartDetailEntity } from './cart-detail.entity'
import { CartStatusEnum } from '../enums/cart.status.enum'

@Entity('carts')
export class CartEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'enum',
		enum: 'cart_status_enum',
		default: CartStatusEnum.ACTIVE,
		nullable: false,
	})
	status: CartStatusEnum

	@ManyToOne(
		(): typeof UserEntity => UserEntity,
		(user: UserEntity): CartEntity[] => user.cart,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity

	@OneToMany(
		(): typeof CartDetailEntity => CartDetailEntity,
		(cartDetail: CartDetailEntity): CartEntity => cartDetail.cart,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	cartDetail: CartDetailEntity[]
}
