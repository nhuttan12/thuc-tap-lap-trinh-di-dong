/*
 * @description Product detail entity
 * @author Nhut Tan
 * @since 2025-09-05
 * @modifies 2025-09-24
 * @modifies 2025-12-31
 * @version 1.0.4
 */

import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { CategoryEntity } from '../../category/entities/category.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_details' })
export class ProductDetailsEntity extends TimestampField {
	@PrimaryColumn()
	id: number;

	@Column()
	size: string;

	@Column()
	color: string;

	@Column()
	rating: number;

	@Column()
	description: string;

	@ManyToOne(
		(): typeof CategoryEntity => CategoryEntity,
		(categoryEntity: CategoryEntity): ProductDetailsEntity[] =>
			categoryEntity.productDetails,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'category_id' })
	categoryEntity: CategoryEntity;

	@OneToOne(
		(): typeof ProductEntity => ProductEntity,
		(productEntity: ProductEntity): ProductDetailsEntity =>
			productEntity.productDetailsEntity,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'id' })
	product: ProductEntity;
}