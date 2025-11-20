/**
 * @description Unit Test file for testing ProductMapper class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { ProductMapper } from './product.mapper';
import { ProductEntity } from '../entities/product.entity';
import { ProductStatusEnum } from '../enums/product-status.enum';
import { ProductEntityResponseDto } from '../dtos/product-entity-response.dto';

describe('ProductMapper', (): void => {
	let productMapper: ProductMapper;

	beforeEach((): void => {
		productMapper = new ProductMapper();
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('toProductEntityListResponseDto', (): void => {
		const productImageUrl1: string = 'https//product-image1.example';
		const productImageUrl2: string = 'https//product-image2.example';
		const mockProductEntityList: ProductEntity[] = [
			{
				id: 1,
				name: 'Product 1',
				price: 100000,
				discount: 0,
				productImages: [
					{
						image: {
							url: productImageUrl1,
						},
					},
				],
				status: ProductStatusEnum.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as ProductEntity,
			{
				id: 2,
				name: 'Product 2',
				price: 200000,
				discount: 10,
				productImages: [
					{
						image: {
							url: productImageUrl2,
						},
					},
				],
				status: ProductStatusEnum.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as ProductEntity,
		];
		const mockProductEntityListResponse: ProductEntityResponseDto[] = [
			{
				id: 1,
				name: 'Product 1',
				price: 100000,
				discount: 0,
				imageUrl: productImageUrl1,
				status: ProductStatusEnum.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: 2,
				name: 'Product 2',
				price: 200000,
				discount: 10,
				imageUrl: productImageUrl2,
				status: ProductStatusEnum.ACTIVE,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		it('should return ProductEntityResponseDto[] after mapped', (): void => {
			const spyToProductEntityListResponseDto = jest.spyOn(
				productMapper,
				'toProductEntityListResponseDto'
			);

			expect(
				productMapper.toProductEntityListResponseDto(
					mockProductEntityList
				)
			).toEqual(mockProductEntityListResponse);

			expect(spyToProductEntityListResponseDto).toHaveBeenCalledTimes(1);
			expect(spyToProductEntityListResponseDto).toHaveBeenCalledWith(
				mockProductEntityList
			);
		});
	});
});
