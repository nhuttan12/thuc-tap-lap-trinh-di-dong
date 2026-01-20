/**
 * @description Unit Test file for testing WishlistItemMapper class
 * @author Nhut Tan
 * @since 2025-11-20
 * @version 1.0.0
 */

import { WishlistItemMapper } from './wishlist-item.mapper';
import { ProductInWishlistResponseDto } from '../dtos/product-in-wishlist-response.dto';
import { ProductEntity } from '../../product/entities/product.entity';
import { WishlistItemEntity } from '../entities/wishlist-item.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { ProductImageEntity } from '../../image/entities/product-image.entity';
import { ProductDetailsEntity } from '../../product/entities/product-details.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { WishlistStatusEnum } from '../enums/wishlist-status.enum';

describe('WishlistItemMapper', (): void => {
	let wishlistItemMapper: WishlistItemMapper;

	beforeEach((): void => {
		wishlistItemMapper = new WishlistItemMapper();
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('toProductInWishlistListResponseDto', (): void => {
		const imageUrl1: string = 'https://image1.example';
		const imageUrl2: string = 'https://image2.example';
		const mockCurrentDate: Date = new Date();
		const mockWishlistItemEntity: WishlistItemEntity[] = [
			{
				id: 1,
				product: {
					name: 'test 1',
					price: 100000,
					discount: 0,
					productImages: [
						{
							image: {
								url: imageUrl1,
							} as ImageEntity,
						},
					] as ProductImageEntity[],
					productDetailsEntity: {
						rating: 5,
					} as ProductDetailsEntity,
					createdAt: mockCurrentDate,
					updatedAt: mockCurrentDate,
				} as ProductEntity,
				user: {} as UserEntity,
				status: {} as WishlistStatusEnum,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
			{
				id: 2,
				product: {
					name: 'test 2',
					price: 200000,
					discount: 10,
					productImages: [
						{
							image: {
								url: imageUrl2,
							} as ImageEntity,
						},
					] as ProductImageEntity[],
					productDetailsEntity: {
						rating: 4,
					} as ProductDetailsEntity,
					createdAt: mockCurrentDate,
					updatedAt: mockCurrentDate,
				} as ProductEntity,
				user: {} as UserEntity,
				status: {} as WishlistStatusEnum,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
		] as WishlistItemEntity[];
		const mockProductInWishlistResponseDto: ProductInWishlistResponseDto[] =
			[
				{
					productID: 1,
					name: 'test 1',
					price: 100000,
					discount: 0,
					imageUrl: imageUrl1,
					rating: 5,
					createdAt: mockCurrentDate.toString(),
					updatedAt: mockCurrentDate.toString(),
				},
				{
					productID: 2,
					name: 'test 2',
					price: 200000,
					discount: 10,
					imageUrl: imageUrl2,
					rating: 4,
					createdAt: mockCurrentDate.toString(),
					updatedAt: mockCurrentDate.toString(),
				},
			];

		it('should return ProductInWishlistListResponseDto[] when toProductInWishlistListResponseDto', (): void => {
			const spyToProductInWishlistListResponseDto = jest.spyOn(
				wishlistItemMapper,
				'toProductInWishlistListResponseDto'
			);

			expect(
				wishlistItemMapper.toProductInWishlistListResponseDto(
					mockWishlistItemEntity
				)
			).toEqual(mockProductInWishlistResponseDto);

			expect(spyToProductInWishlistListResponseDto).toBeCalledWith(
				mockWishlistItemEntity
			);
			expect(spyToProductInWishlistListResponseDto).toHaveBeenCalledTimes(
				1
			);
		});
	});
});
