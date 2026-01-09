/**
 * @description Unit Test file for testing ProductService class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductMapper } from './mappers/product.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { ProductEntity } from './entities/product.entity';
import { ProductEntityResponseDto } from './dtos/product-entity-response.dto';
import { ProductStatusEnum } from './enums/product-status.enum';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';

describe('ProductService', (): void => {
	let productService: ProductService;

	const mockProductRepository = {
		getProductsPaging: jest.fn(),
	};

	const mockProductMapper = {
		toProductEntityListResponseDto: jest.fn(),
	};

	const mockBuildPagingMetaService = {
		calculateSkip: jest.fn(),
		buildPagingResponse: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					provide: ProductRepository,
					useValue: mockProductRepository,
				},
				{
					provide: ProductMapper,
					useValue: mockProductMapper,
				},
				{
					provide: BuildPagingMetaService,
					useValue: mockBuildPagingMetaService,
				},
			],
		}).compile();

		productService = module.get<ProductService>(ProductService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('ProductService', (): void => {
		const mockPage: number = 1;
		const mockLimit: number = 10;
		const mockSkip: number = 0;
		const productImageUrl1: string = 'https://product-image1.example';
		const productImageUrl2: string = 'https://product-image2.example';
		const mockCurrentDate: Date = new Date();
		const mockProducts: ProductEntity[] = [
			{
				id: 1,
				name: 'Product 1',
				price: 100000,
				discount: 0,
				productImages: [
					{
						image: {
							url: productImageUrl1,
						} as ImageEntity,
					} as ProductImageEntity,
				],
				status: ProductStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
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
						} as ImageEntity,
					} as ProductImageEntity,
				],
				status: ProductStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			} as ProductEntity,
		];
		const mockProductResponseList: ProductEntityResponseDto[] = [
			{
				id: 1,
				name: 'Product 1',
				price: 100000,
				discount: 0,
				imageUrl: productImageUrl1,
				status: ProductStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
			{
				id: 2,
				name: 'Product 2',
				price: 200000,
				discount: 10,
				imageUrl: productImageUrl2,
				status: ProductStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
		];
		const mockTotal: number = 30;
		const mockTotalPage: number = 3;
		const mockResponse: PagingResponseDto<ProductEntityResponseDto> = {
			data: mockProductResponseList,
			meta: {
				totalPages: mockTotalPage,
				hasNextPage: true,
				hasPreviousPage: false,
				totalItems: mockTotal,
				limit: mockLimit,
				page: mockPage,
			},
		};

		it('should return ProductEntityResponseDto[] after getProductsPaging', async (): Promise<void> => {
			/**
			 * Mock value return and resolved
			 */
			mockBuildPagingMetaService.calculateSkip.mockReturnValueOnce(
				mockSkip
			);
			mockProductRepository.getProductsPaging.mockResolvedValueOnce([
				mockProducts,
				mockTotal,
			]);
			mockProductMapper.toProductEntityListResponseDto.mockReturnValueOnce(
				mockProductResponseList
			);
			mockBuildPagingMetaService.buildPagingResponse.mockReturnValueOnce(
				mockResponse
			);

			/**
			 * Spy function call
			 */
			const spyGetProductsPaging = jest.spyOn(
				productService,
				'getProductsPaging'
			);

			/**
			 * Assert
			 */
			await expect(
				productService.getProductsPaging(mockPage, mockLimit)
			).resolves.toEqual(mockResponse);

			/**
			 * Assert spy function call
			 */
			expect(spyGetProductsPaging).toHaveBeenCalledTimes(1);
			expect(spyGetProductsPaging).toHaveBeenCalledWith(
				mockPage,
				mockLimit
			);

			/**
			 * Assert calculateSkip
			 */
			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledWith(mockPage, mockLimit);
			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledTimes(1);

			/**
			 * Assert getProductsPaging
			 */
			expect(
				mockProductRepository.getProductsPaging
			).toHaveBeenCalledWith(mockLimit, mockSkip);
			expect(
				mockProductRepository.getProductsPaging
			).toHaveBeenCalledTimes(1);

			/**
			 * Assert toProductEntityListResponseDto
			 */
			expect(
				mockProductMapper.toProductEntityListResponseDto
			).toHaveBeenCalledWith(mockProducts);
			expect(
				mockProductMapper.toProductEntityListResponseDto
			).toHaveBeenCalledTimes(1);

			/**
			 * Assert buildPagingResponse
			 */
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).toHaveBeenCalledWith(
				mockProductResponseList,
				mockPage,
				mockLimit,
				mockTotal
			);
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).toHaveBeenCalledTimes(1);
		});
	});
});
