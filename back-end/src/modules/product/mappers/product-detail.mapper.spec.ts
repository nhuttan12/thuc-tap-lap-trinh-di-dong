/**
 * @description Unit Test file for testing ProductDetailMapper class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { ProductDetailMapper } from './product-detail.mapper';
import { ProductDetailsEntity } from '../entities/product-details.entity';
import { ProductDetailResponseDto } from '../dtos/product-detail-response.dto';
import { ProductImageEntity } from '../../image/entities/product-image.entity';
import { ImageEntity } from '../../image/entities/image.entity';
import { ProductEntity } from '../entities/product.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import { StringHelper } from '../../../common/helper/string-helper';

describe('ProductDetailMapper', (): void => {
	let mapper: ProductDetailMapper;

	beforeEach((): void => {
		mapper = new ProductDetailMapper(new StringHelper());
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('toProductDetailResponse', (): void => {
		const mockCurrentDate: Date = new Date();
		const imageUrl1: string = 'http://image_1.example.com';
		const imageUrl2: string = 'http://image_2.example.com';
		const imageUrl3: string = 'http://image_3.example.com';
		const mockProductDetailEntity: ProductDetailsEntity = {
			id: 1,
			size: 'L, XL, XXL',
			color: 'blue',
			description: 'mockDescription',
			rating: 0.0,
			product: {
				name: 'product 1',
				price: 100000,
				discount: 0,
				productImages: [
					{
						image: {
							id: 1,
							url: imageUrl1,
						} as ImageEntity,
					},
					{
						image: {
							id: 2,
							url: imageUrl2,
						} as ImageEntity,
					},
					{
						image: {
							id: 3,
							url: imageUrl3,
						} as ImageEntity,
					},
				] as unknown as ProductImageEntity,
			} as unknown as ProductEntity,
			categoryEntity: {} as unknown as CategoryEntity,
			updatedAt: mockCurrentDate,
			createdAt: mockCurrentDate,
		} as unknown as ProductDetailsEntity;
		const mockProductDetailResponse: ProductDetailResponseDto = {
			id: 1,
			name: 'product 1',
			price: 100000,
			discount: 0,
			rating: 0.0,
			size: ['L', 'XL', 'XXL'],
			color: ['blue'],
			description: 'mockDescription',
			imageList: [imageUrl1, imageUrl2, imageUrl3],
		};

		it('should return ProductDetailEntityResponseDto after mapped', (): void => {
			const spyToProductDetailResponse = jest.spyOn(
				mapper,
				'toProductDetailResponse'
			);

			expect(
				mapper.toProductDetailResponse(mockProductDetailEntity)
			).toEqual(mockProductDetailResponse);

			expect(spyToProductDetailResponse).toHaveBeenCalledTimes(1);
			expect(spyToProductDetailResponse).toHaveBeenCalledWith(
				mockProductDetailEntity
			);
		});
	});
});
