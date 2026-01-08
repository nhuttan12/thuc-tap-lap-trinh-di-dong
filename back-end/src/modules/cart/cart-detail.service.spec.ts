/**
 * @description Unit Test file for Testing functions in CartDetailService file
 * @author Nhut Tan
 * @since 2025-11-18
 * @version 1.0.0
 */

import { CartDetailService } from './cart-detail.service';
import { CartDetailRepository } from './repositories/cart-detail.repository';
import { CartDetailMapper } from './mappers/cart-detail.mapper';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartDetailsStatusEnum } from './enums/cart-details-status.enum';
import { CartEntity } from './entities/cart.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';

describe('CartDetailService', (): void => {
	let cartDetailService: CartDetailService;

	const mockCartDetailRepository = {
		getCartDetailsByUserID: jest.fn(),
		createCartDetail: jest.fn(),
	};

	const mockCartDetailMapper = {
		toCartDetailsResponseDto: jest.fn(),
		toCartDetailResponseDto: jest.fn(),
	};

	const mockBuildPagingMetaService = {
		calculateSkip: jest.fn(),
		buildPagingResponse: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartDetailService,
				{
					provide: CartDetailRepository,
					useValue: mockCartDetailRepository,
				},
				{
					provide: CartDetailMapper,
					useValue: mockCartDetailMapper,
				},
				{
					provide: BuildPagingMetaService,
					useValue: mockBuildPagingMetaService,
				},
			],
		}).compile();

		cartDetailService = module.get<CartDetailService>(CartDetailService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('getCartDetailsByUserID', (): void => {
		/**
		 * Mocking data
		 */
		const mockPage: number = 1;
		const mockLimit: number = 10;
		const mockUserID: number = 1;
		const mockSkip: number = 0;
		const mockCurrentDate: Date = new Date();
		const mockUrlImage1: string = 'https://example.com/image1.jpg';
		const mockUrlImage2: string = 'https://example.com/image2.jpg';
		const mockUrlImage3: string = 'https://example.com/image3.jpg';
		const mockCartDetailEntity: CartDetailEntity[] = [
			{
				id: 1,
				quantity: 2,
				status: CartDetailsStatusEnum.ACTIVE,
				cart: { id: 1 } as CartEntity,
				product: {
					id: 1,
					productImages: [
						{
							id: 1,
							image: { id: 1, url: mockUrlImage1 } as ImageEntity,
						},
					] as ProductImageEntity[],
					discount: 10,
					price: 100000,
					name: 'Mock product',
				} as ProductEntity,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
			{
				id: 2,
				quantity: 1,
				status: CartDetailsStatusEnum.ACTIVE,
				cart: { id: 1 } as CartEntity,
				product: {
					id: 1,
					productImages: [
						{
							id: 2,
							image: { id: 2, url: mockUrlImage2 } as ImageEntity,
						},
					],
					discount: 0,
					price: 200000,
					name: 'Mock product 2',
				} as ProductEntity,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
			{
				id: 3,
				quantity: 5,
				status: CartDetailsStatusEnum.DELETED,
				cart: { id: 2 } as CartEntity,
				product: {
					id: 3,
					productImages: [
						{
							id: 3,
							image: { id: 3, url: mockUrlImage3 } as ImageEntity,
						},
					],
					discount: 5,
					price: 300000,
					name: 'Mock product 3',
				} as ProductEntity,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
			},
		];
		const mockCartDetailResponseDto: CartDetailResponseDto[] = [
			{
				id: 1,
				images: mockUrlImage1,
				name: 'Mock product 1',
				price: 100000,
				discount: 10,
				quantity: 2,
			},
			{
				id: 2,
				images: mockUrlImage2,
				name: 'Mock product 2',
				price: 200000,
				discount: 0,
				quantity: 1,
			},
			{
				id: 3,
				images: mockUrlImage3,
				name: 'Mock product 3',
				price: 300000,
				discount: 5,
				quantity: 5,
			},
		];
		const mockTotal: number = 30;
		const mockHasNextPage: boolean = true;
		const mockTotalPages: number = 30;
		const mockPagingResponse: PagingResponseDto<CartDetailResponseDto> = {
			data: mockCartDetailResponseDto,
			meta: {
				page: mockPage,
				limit: mockLimit,
				totalItems: mockTotal,
				hasNextPage: mockHasNextPage,
				hasPreviousPage: false,
				totalPages: mockTotalPages,
			},
		};

		it('should return PagingResponseDto<CartDetailResponseDto> when get cart details list', async (): Promise<void> => {
			/**
			 * Mocking value
			 */
			mockBuildPagingMetaService.calculateSkip.mockReturnValueOnce(
				mockSkip
			);
			mockCartDetailRepository.getCartDetailsByUserID.mockResolvedValueOnce(
				[mockCartDetailEntity, mockTotal]
			);
			mockCartDetailMapper.toCartDetailsResponseDto.mockReturnValueOnce(
				mockCartDetailResponseDto
			);
			mockBuildPagingMetaService.buildPagingResponse.mockReturnValueOnce(
				mockPagingResponse
			);

			/**
			 * Mocking function called
			 */
			const spyLoggerLog = jest
				.spyOn(cartDetailService['logger'], 'debug')
				.mockImplementation((): void => {});
			const spyLoggerError = jest
				.spyOn(cartDetailService['logger'], 'error')
				.mockImplementation((): void => {});
			const spyGetCartDetailsByUserID = jest.spyOn(
				cartDetailService,
				'getCartDetailsByUserID'
			);

			/**
			 * Assert
			 */
			await expect(
				cartDetailService.getCartDetailsByUserID(
					mockUserID,
					mockPage,
					mockLimit
				)
			).resolves.toEqual(mockPagingResponse);

			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledWith(mockPage, mockLimit);
			expect(
				mockCartDetailRepository.getCartDetailsByUserID
			).toHaveBeenCalledWith(mockUserID, mockSkip, mockLimit);
			expect(
				mockCartDetailMapper.toCartDetailsResponseDto
			).toHaveBeenCalledWith(mockCartDetailEntity);
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).toHaveBeenCalledWith(
				mockCartDetailResponseDto,
				mockTotal,
				mockPage,
				mockLimit
			);
			expect(spyGetCartDetailsByUserID).toHaveBeenNthCalledWith(
				1,
				mockUserID,
				mockPage,
				mockLimit
			);

			expect(spyLoggerLog).toHaveBeenCalledTimes(3);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);
			expect(spyLoggerLog).toHaveBeenNthCalledWith(
				1,
				`Calculate skip and take: ${mockSkip}`
			);
			expect(spyLoggerLog).toHaveBeenNthCalledWith(
				2,
				`Calling \`getCartDetailsByUserID\` from \`CartDetailRepository\`: ${JSON.stringify(mockCartDetailEntity, null, 2)}, total: ${mockTotal}`
			);
			expect(spyLoggerLog).toHaveBeenNthCalledWith(
				3,
				`Convert \`CartDetailEntity\` to \`CartDetailResponseDto\`: ${JSON.stringify(mockCartDetailResponseDto, null, 2)}`
			);
		});
	});

	describe('createNewCartDetail', (): void => {
		/**
		 * Mocking data
		 */
		const mockCurrentDate: Date = new Date();
		const mockUrlImage1: string = 'https://example.com/image1.jpg';
		const mockProduct1: ProductEntity = {
			id: 1,
			productImages: [
				{
					id: 1,
					image: { id: 1, url: mockUrlImage1 } as ImageEntity,
				},
			] as ProductImageEntity[],
			discount: 10,
			price: 100000,
			name: 'Mock product',
		} as ProductEntity;
		const mockCartDetailEntity: CartDetailEntity = {
			id: 1,
			quantity: 2,
			status: CartDetailsStatusEnum.ACTIVE,
			cart: { id: 1 } as CartEntity,
			product: mockProduct1,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};
		const mockCartDetailResponseDto: CartDetailResponseDto = {
			id: 1,
			images: mockUrlImage1,
			name: 'Mock product 1',
			price: 100000,
			discount: 10,
			quantity: 2,
		};
		const mockProductID: number = mockProduct1.id;
		const mockCartID: number = 1;
		const mockQuantity: number = 5;

		it('should return CartDetailResponseDto when create new cart', async (): Promise<void> => {
			/**
			 * Mocking value return
			 */
			mockCartDetailRepository.createCartDetail.mockResolvedValueOnce(
				mockCartDetailEntity
			);
			mockCartDetailMapper.toCartDetailResponseDto.mockReturnValueOnce(
				mockCartDetailResponseDto
			);

			/**
			 * Mocking spy function called
			 */
			const loggerSpyDebug = jest
				.spyOn(cartDetailService['logger'], 'debug')
				.mockImplementation((): void => {});
			const loggerSpyError = jest
				.spyOn(cartDetailService['logger'], 'error')
				.mockImplementation((): void => {});
			const spyCreateNewCartDetail = jest.spyOn(
				cartDetailService,
				'createNewCartDetail'
			);

			await expect(
				cartDetailService.createNewCartDetail(
					mockProductID,
					mockCartID,
					mockQuantity
				)
			).resolves.toEqual(mockCartDetailResponseDto);

			expect(
				mockCartDetailRepository.createCartDetail
			).toHaveBeenCalledWith(mockProductID, mockCartID, mockQuantity);
			expect(
				mockCartDetailMapper.toCartDetailResponseDto
			).toHaveBeenCalledWith(mockCartDetailEntity);

			expect(spyCreateNewCartDetail).toHaveBeenCalledWith(
				mockProductID,
				mockCartID,
				mockQuantity
			);
			expect(loggerSpyDebug).toHaveBeenCalledTimes(1);
			expect(loggerSpyError).toHaveBeenCalledTimes(0);
		});
	});
});
