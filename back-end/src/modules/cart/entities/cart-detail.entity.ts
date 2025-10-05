/**
 * @description Cart detail entity
 * @author Nhut Tan
 * @since 2025-09-07
 * @modifies 2025-09-24
 * @version 1.0.3
 */

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { TimestampField } from '../../../common/database/timestamp.field'
import { CartEntity } from './cart.entity'
import { ProductEntity } from '../../product/entities/product.entity'
import { CartDetailsStatusEnum } from '../enums/cart-details.status.enum'

@Entity('cart_details')
export class CartDetailEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	quantity: number

	@Column({
		type: 'enum',
		enumName: 'cart_details_status_enum',
		default: CartDetailsStatusEnum.ACTIVE,
		nullable: false,
	})
	status: CartDetailsStatusEnum

	@ManyToOne(
		(): typeof CartEntity => CartEntity,
		(cart: CartEntity): CartDetailEntity[] => cart.cartDetail,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'cart_id' })
	cart: CartEntity

	@ManyToOne(
		(): typeof ProductEntity => ProductEntity,
		(productEntity: ProductEntity): CartDetailEntity[] =>
			productEntity.cartDetail,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'cart_id' })
	product: ProductEntity
}
