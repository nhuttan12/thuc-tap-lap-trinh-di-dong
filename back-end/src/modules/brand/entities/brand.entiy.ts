/**
 * @description Brand entity
 * @author Nhut Tan
 * @since 2025-12-11
 * @modifies 2025-12-11
 * @version 1.0.1
 */

import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TimestampField } from '../../../common/database/timestamp.field';
import { BrandStatusEnum } from '../enums/brand-status.enum';
import { ProductDetailsEntity } from '../../product/entities/product-details.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { ProductImageEntity } from '../../image/entities/product-image.entity';

@Entity({ name: 'brands' })
export class BrandEntity extends TimestampField {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(
		(): typeof ImageEntity => ImageEntity,
		(imageEntity: ImageEntity): ProductImageEntity =>
			imageEntity.productImage,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	@JoinColumn({ name: 'image_id' })
	image: ImageEntity;

	@Column()
	name: string;

	@Column({
		type: 'enum',
		enum: BrandStatusEnum,
		default: BrandStatusEnum.ACTIVE,
		nullable: false,
	})
	status: BrandStatusEnum;

	@OneToMany(
		(): typeof ProductDetailsEntity => ProductDetailsEntity,
		(productDetailsEntity: ProductDetailsEntity): BrandEntity =>
			productDetailsEntity.brandEntity,
		{
			cascade: ['insert', 'update', 'soft-remove'],
		}
	)
	productDetails: ProductDetailsEntity[];
}
