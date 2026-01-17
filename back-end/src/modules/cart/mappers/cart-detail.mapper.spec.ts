/**
 * @description Unit test for CartDetailMapper class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { CartDetailMapper } from './cart-detail.mapper';
import { CartDetailEntity } from '../entities/cart-detail.entity';
import { CartDetailsStatusEnum } from '../enums/cart-details-status.enum';
import { ProductStatusEnum } from '../../product/enums/product-status.enum';
import { ImageStatusEnum } from '../../image/enums/image-status.enum';
import { ProductImageTypeEnum } from '../../product/enums/product-image-type.enum';
import { ImageEntity } from '../../image/entities/image.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { CartEntity } from '../entities/cart.entity';
import { ProductDetailsEntity } from '../../product/entities/product-details.entity';
import { WishlistItemEntity } from '../../wishlist/entities/wishlist-item.entity';
import { CartDetailResponseDto } from '../dtos/cart-detail-response.dto';
import { cloneDeep } from 'lodash';

describe('CartDetailMapper', (): void => {
	let cartDetailMapper: CartDetailMapper;

	beforeEach((): void => {
		cartDetailMapper = new CartDetailMapper();
	});

	/**
	 * @description Create mocking variable
	 */
	const cartDetailsEntity: CartDetailEntity[] = [
		{
			id: 1,
			status: CartDetailsStatusEnum.ACTIVE,
			quantity: 1,
			product: {
				id: 1,
				status: ProductStatusEnum.ACTIVE,
				name: 'Product 1',
				discount: 0,
				price: 100000,
				productImages: [
					{
						id: 1,
						type: ProductImageTypeEnum.PRODUCT,
						image: {
							id: 1,
							url: 'https://example.com/image.jpg',
							status: ImageStatusEnum.ACTIVE,
							updatedAt: new Date(),
							createdAt: new Date(),
						} as unknown as ImageEntity,
						createdAt: new Date(),
						updatedAt: new Date(),
						product: {} as ProductEntity,
					},
				],
				cartDetails: [],
				orderDetails: [],
				productDetailsEntity: {} as ProductDetailsEntity,
				wishlistItems: [
					{} as WishlistItemEntity,
				] as WishlistItemEntity[],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			cart: {} as CartEntity,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: 2,
			status: CartDetailsStatusEnum.ACTIVE,
			quantity: 2,
			product: {
				id: 2,
				status: ProductStatusEnum.ACTIVE,
				name: 'Product 2',
				discount: 0.5,
				price: 120000,
				productImages: [
					{
						id: 2,
						type: ProductImageTypeEnum.PRODUCT,
						image: {
							id: 2,
							url: 'https://example.com/image2.jpg',
							status: ImageStatusEnum.ACTIVE,
							updatedAt: new Date(),
							createdAt: new Date(),
						} as unknown as ImageEntity,
						createdAt: new Date(),
						updatedAt: new Date(),
						product: {} as ProductEntity,
					},
				],
				cartDetails: [],
				orderDetails: [],
				productDetailsEntity: {} as ProductDetailsEntity,
				wishlistItems: [
					{} as WishlistItemEntity,
				] as WishlistItemEntity[],
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			cart: {} as CartEntity,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const cartDetailsResponseDto: CartDetailResponseDto[] = [
		{
			id: 1,
			quantity: 1,
			discount: 0,
			price: 100000,
			name: 'Product 1',
			imageUrl: 'https://example.com/image.jpg',
		},
		{
			id: 2,
			quantity: 2,
			discount: 0.5,
			price: 120000,
			name: 'Product 2',
			imageUrl: 'https://example.com/image2.jpg',
		},
	];

	const cartDetailEntity: CartDetailEntity = {
		id: 1,
		status: CartDetailsStatusEnum.ACTIVE,
		quantity: 1,
		product: {
			id: 1,
			status: ProductStatusEnum.ACTIVE,
			name: 'Product 1',
			discount: 0,
			price: 100000,
			productImages: [
				{
					id: 1,
					type: ProductImageTypeEnum.PRODUCT,
					image: {
						id: 1,
						url: 'https://example.com/image.jpg',
						status: ImageStatusEnum.ACTIVE,
						updatedAt: new Date(),
						createdAt: new Date(),
					} as unknown as ImageEntity,
					createdAt: new Date(),
					updatedAt: new Date(),
					product: {} as ProductEntity,
				},
			],
			cartDetails: [],
			orderDetails: [],
			productDetailsEntity: {} as ProductDetailsEntity,
			wishlistItems: [{} as WishlistItemEntity] as WishlistItemEntity[],
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		cart: {} as CartEntity,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const cartDetailResponseDto: CartDetailResponseDto = {
		id: 1,
		quantity: 1,
		discount: 0,
		price: 100000,
		name: 'Product 1',
		imageUrl: 'https://example.com/image.jpg',
	};

	/**
	 * @description Test toCartDetailsResponseDto function mapping CartDetailEntity[] to CartDetailResponseDto[]
	 */
	it('should mapping CartDetailEntity[] to CartDetailResponseDto[]', (): void => {
		const result: CartDetailResponseDto[] =
			cartDetailMapper.toCartDetailListResponseDto(cartDetailsEntity);

		expect(result).toEqual(cartDetailsResponseDto);
	});

	/**
	 * @description Test toCartDetailResponseDto function mapping CartDetailEntity to CartDetailResponseDto
	 */
	it('should mapping CartDetailEntity to CartDetailResponseDto', (): void => {
		const result: CartDetailResponseDto =
			cartDetailMapper.toCartDetailResponseDto(cartDetailEntity);

		expect(result).toEqual(cartDetailResponseDto);
	});

	/**
	 * @description Test toCartDetailsResponseDto function not mutate the original CartDetailEntity[] object
	 */
	it('should not mutate the CartDetailEntity[] original after mapping', (): void => {
		const originalCopy: CartDetailEntity[] = cloneDeep(cartDetailsEntity);

		cartDetailMapper.toCartDetailListResponseDto(cartDetailsEntity);

		expect(cartDetailsEntity).toEqual(originalCopy);
	});

	/**
	 * @description Test toCartDetailResponseDto function not mutate the original CartDetailEntity object
	 */
	it('should not mutate CartDetailEntity original after mapping', (): void => {
		const originalCopy: CartDetailEntity = cloneDeep(cartDetailEntity);

		cartDetailMapper.toCartDetailResponseDto(cartDetailEntity);

		expect(cartDetailEntity).toEqual(originalCopy);
	});
});
