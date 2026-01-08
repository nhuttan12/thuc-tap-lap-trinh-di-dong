/**
 * @description Unit Test file for testing ProductDetailService class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { ProductDetailService } from './product-detail.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailRepository } from './repositories/product-detail.repository';
import { ProductDetailMapper } from './mappers/product-detail.mapper';
import { ProductDetailsEntity } from './entities/product-details.entity';
import { ProductDetailResponseDto } from './dtos/product-detail-response.dto';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { BadRequestException } from '@nestjs/common';
import { BrandEntity } from '../brand/entities/brand.entiy';

describe('ProductDetailService', (): void => {
	let productDetailService: ProductDetailService;

	const mockProductDetailRepository = {
		getProductDetailByProductID: jest.fn(),
	};

	const mockProductDetailMapper = {
		toProductDetailResponse: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductDetailService,
				{
					provide: ProductDetailRepository,
					useValue: mockProductDetailRepository,
				},
				{
					provide: ProductDetailMapper,
					useValue: mockProductDetailMapper,
				},
			],
		}).compile();

		productDetailService =
			module.get<ProductDetailService>(ProductDetailService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('getProductDetailByProductID', (): void => {
		const mockProductID: number = 1;
		const mockCurrentDate: Date = new Date();
		const imageUrl1: string = 'https://product-image1.example';
		const imageUrl2: string = 'https://product-image2.example';

		const mockProductDetailEntity: ProductDetailsEntity = {
			id: 1,
			productID: mockProductID,
			name: 'Product Detail 1',
			size: 'L, XL, XXL',
			color: 'blue',
			description: 'Product Detail 1',
			rating: 5,
			price: 100000,
			brandEntity: {} as BrandEntity,
			discount: 0,
			imageList: [
				{
					image: {
						url: imageUrl1,
					} as ImageEntity,
				} as ProductImageEntity,
				{
					image: {
						url: imageUrl2,
					} as ImageEntity,
				} as ProductImageEntity,
			],
			product: {} as ProductEntity,
			categoryEntity: {} as CategoryEntity,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as ProductDetailsEntity;

		const mockProductDetailResponse: ProductDetailResponseDto = {
			id: 1,
			productID: mockProductID,
			name: 'Product Detail 1',
			size: ['L', 'XL', 'XXL'],
			color: ['blue'],
			description: 'Product Detail 1',
			rating: 5,
			price: 100000,
			discount: 0,
			imageList: [imageUrl1, imageUrl2],
		} as ProductDetailResponseDto;

		it('should return ProductDetailResponse when getProductDetailByProductID', async (): Promise<void> => {
			/**
			 * Mock data resolve and return
			 */
			mockProductDetailRepository.getProductDetailByProductID.mockResolvedValueOnce(
				mockProductDetailEntity
			);
			mockProductDetailMapper.toProductDetailResponse.mockReturnValueOnce(
				mockProductDetailResponse
			);

			/**
			 * Spy logger
			 */
			const spyLoggerDebug = jest
				.spyOn(productDetailService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(productDetailService['logger'], 'warn')
				.mockImplementation();
			const spyGetProductDetailByProductID = jest.spyOn(
				productDetailService,
				'getProductDetailByProductID'
			);

			/**
			 * Assert equal
			 */
			await expect(
				productDetailService.getProductDetailByProductID(mockProductID)
			).resolves.toEqual(mockProductDetailResponse);

			/**
			 * Assert data call with
			 */
			expect(
				mockProductDetailRepository.getProductDetailByProductID
			).toHaveBeenCalledWith(mockProductID);
			expect(
				mockProductDetailMapper.toProductDetailResponse
			).toHaveBeenCalledWith(mockProductDetailEntity);

			/**
			 * Assert call time
			 */
			expect(
				mockProductDetailRepository.getProductDetailByProductID
			).toHaveBeenCalledTimes(1);
			expect(
				mockProductDetailMapper.toProductDetailResponse
			).toHaveBeenCalledTimes(1);
			expect(spyGetProductDetailByProductID).toHaveBeenCalledWith(
				mockProductID
			);
			expect(spyGetProductDetailByProductID).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Product detail in service: ${JSON.stringify(mockProductDetailEntity, null, 2)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Product detail in response: ${JSON.stringify(mockProductDetailResponse, null, 2)}`
			);

			/**
			 * Assert logger
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
		});

		it('should throw BadRequestException when productDetailEntity not found', async (): Promise<void> => {
			/**
			 * Mock resolve and return data
			 */
			mockProductDetailRepository.getProductDetailByProductID.mockResolvedValueOnce(
				null
			);

			/**
			 * Spy logger
			 */
			const spyLoggerDebug = jest
				.spyOn(productDetailService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(productDetailService['logger'], 'warn')
				.mockImplementation();

			/**
			 * Assert throw error
			 */
			await expect(
				productDetailService.getProductDetailByProductID(mockProductID)
			).rejects.toThrow(BadRequestException);

			/**
			 * Assert called with
			 */
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Product detail in service: ${null}`
			);
			expect(spyLoggerWarn).toHaveBeenCalledWith(
				'Product detail not found'
			);

			/**
			 * Assert call time
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(1);
			expect(
				mockProductDetailMapper.toProductDetailResponse
			).not.toHaveBeenCalled();
		});
	});
});
