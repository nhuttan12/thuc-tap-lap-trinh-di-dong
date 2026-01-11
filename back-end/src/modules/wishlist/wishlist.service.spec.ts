import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { WishlistItemRepository } from './repositories/wishlist-item.repository';
import { WishlistItemMapper } from './mappers/wishlist-item.mapper';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { ProductInWishlistResponseDto } from './dtos/product-in-wishlist-response.dto';
import { ProductImageEntity } from '../image/entities/product-image.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { WishlistStatusEnum } from './enums/wishlist-status.enum';
import { UserEntity } from '../user/entities/user.entity';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductDetailsEntity } from '../product/entities/product-details.entity';
import { PagingResponseDto } from '../../common/helper/dtos/paging-response.dto';
import { BadRequestException } from '@nestjs/common';
import { BuildPagingMetaService } from '../../common/helper/build-paging-meta.service';

/**
 * @description Test file for Unit Testing functions in WishlistService file
 * @author Nhut Tan
 * @since 2025-11-20
 * @version 1.0.0
 */
describe('WishlistService', (): void => {
	let mockWishlistService: WishlistService;

	const mockWishlistItemRepository = {
		getAllWishlistItems: jest.fn(),
		createWishlistItem: jest.fn(),
		getWishlistItemByProductIDAndUserID: jest.fn(),
		removeWishlistItem: jest.fn(),
	};

	const mockWishlistItemMapper = {
		toProductInWishlistListResponseDto: jest.fn(),
	};

	const mockBuildPagingMetaService = {
		calculateSkip: jest.fn(),
		buildPagingResponse: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				WishlistService,
				{
					provide: WishlistItemRepository,
					useValue: mockWishlistItemRepository,
				},
				{
					provide: WishlistItemMapper,
					useValue: mockWishlistItemMapper,
				},
				{
					provide: BuildPagingMetaService,
					useValue: mockBuildPagingMetaService,
				},
			],
		}).compile();

		mockWishlistService = module.get<WishlistService>(WishlistService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('getProductsInWishlistPaging', (): void => {
		const mockUserID: number = 1;
		const mockPage: number = 1;
		const mockLimit: number = 10;
		const mockSkip: number = 0;
		const mockImageUrl1: string = 'https://example_image1.com';
		const mockImageUrl2: string = 'https://example_image2.com';
		const mockImageUrl3: string = 'https://example_image3.com';
		const mockCurrentDate: Date = new Date();
		const mockWishlistItems: WishlistItemEntity[] = [
			{
				id: 1,
				product: {
					name: 'Product 1',
					price: 100000,
					discount: 0,
					productImages: [
						{
							image: {
								url: mockImageUrl1,
							} as ImageEntity,
						},
					] as ProductImageEntity[],
					productDetailsEntity: {
						rating: 0,
					} as ProductDetailsEntity,
				} as ProductEntity,
				status: WishlistStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
				user: {} as UserEntity,
			},
			{
				id: 2,
				product: {
					name: 'Product 2',
					price: 200000,
					discount: 5,
					productImages: [
						{
							image: {
								url: mockImageUrl3,
							} as ImageEntity,
						},
					] as ProductImageEntity[],
					productDetailsEntity: {
						rating: 3,
					} as ProductDetailsEntity,
				} as ProductEntity,
				status: WishlistStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
				user: {} as UserEntity,
			},
			{
				id: 3,
				product: {
					name: 'Product 3',
					price: 400000,
					discount: 10,
					productImages: [
						{
							image: {
								url: mockImageUrl3,
							} as ImageEntity,
						},
					] as ProductImageEntity[],
					productDetailsEntity: {
						rating: 5,
					} as ProductDetailsEntity,
				} as ProductEntity,
				status: WishlistStatusEnum.ACTIVE,
				createdAt: mockCurrentDate,
				updatedAt: mockCurrentDate,
				user: {} as UserEntity,
			},
		];
		const mockTotal: number = 30;
		const mockProductInWishlistResponseDto: ProductInWishlistResponseDto[] =
			[
				{
					id: 1,
					imageUrl: mockImageUrl1,
					rating: 0,
					discount: 0,
					name: 'Product 1',
					price: 100000,
					createdAt: mockCurrentDate,
					updatedAt: mockCurrentDate,
				},
				{
					id: 2,
					imageUrl: mockImageUrl2,
					rating: 3,
					discount: 5,
					name: 'Product 2',
					price: 200000,
					createdAt: mockCurrentDate,
					updatedAt: mockCurrentDate,
				},
				{
					id: 3,
					imageUrl: mockImageUrl3,
					rating: 5,
					discount: 10,
					name: 'Product 3',
					price: 400000,
					createdAt: mockCurrentDate,
					updatedAt: mockCurrentDate,
				},
			];
		const mockPagingResponse: PagingResponseDto<ProductInWishlistResponseDto> =
			{
				meta: {
					page: mockSkip,
					limit: mockLimit,
					totalItems: mockTotal,
					totalPages: mockPage,
					hasPreviousPage: false,
					hasNextPage: true,
				},
				data: mockProductInWishlistResponseDto,
			};

		it('should return PagingResponseDto<ProductInWishlistResponseDto> when get product in wishlist paging', async (): Promise<void> => {
			/**
			 * Mock return and resolve data
			 */
			mockBuildPagingMetaService.calculateSkip.mockReturnValueOnce(
				mockSkip
			);
			mockWishlistItemRepository.getAllWishlistItems.mockResolvedValueOnce(
				[mockWishlistItems, mockTotal]
			);
			mockWishlistItemMapper.toProductInWishlistListResponseDto.mockReturnValueOnce(
				mockProductInWishlistResponseDto
			);
			mockBuildPagingMetaService.buildPagingResponse.mockReturnValueOnce(
				mockPagingResponse
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();
			const spyGetProductInWishlistPaging = jest.spyOn(
				mockWishlistService,
				'getProductsInWishlistPaging'
			);

			/**
			 * Assert equal
			 */
			const result: PagingResponseDto<ProductInWishlistResponseDto> =
				await mockWishlistService.getProductsInWishlistPaging(
					mockUserID,
					mockPage,
					mockLimit
				);
			expect(result).toEqual(mockPagingResponse);

			/**
			 * Assert called time
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(3);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);
			expect(spyGetProductInWishlistPaging).toHaveBeenCalledTimes(1);
			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemRepository.getAllWishlistItems
			).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemMapper.toProductInWishlistListResponseDto
			).toHaveBeenCalledTimes(1);
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).toHaveBeenCalledTimes(1);

			/**
			 * Assert called with
			 */
			expect(spyGetProductInWishlistPaging).toHaveBeenCalledWith(
				mockUserID,
				mockPage,
				mockLimit
			);
			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledWith(mockPage, mockLimit);
			expect(
				mockWishlistItemRepository.getAllWishlistItems
			).toHaveBeenCalledWith(mockUserID, mockSkip, mockLimit);
			expect(
				mockWishlistItemMapper.toProductInWishlistListResponseDto
			).toHaveBeenCalledWith(mockWishlistItems);
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).toHaveBeenCalledWith(
				mockProductInWishlistResponseDto,
				mockSkip,
				mockLimit,
				mockTotal
			);
		});

		it('should throw Internal Error Exception when no database connection', async (): Promise<void> => {
			/**
			 * Mock throw error
			 */
			mockWishlistItemRepository.getAllWishlistItems.mockRejectedValueOnce(
				new Error('Database connection error')
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();
			const spyGetProductInWishlistPaging = jest.spyOn(
				mockWishlistService,
				'getProductsInWishlistPaging'
			);

			/**
			 * Assert throw error
			 */
			await expect(
				mockWishlistService.getProductsInWishlistPaging(
					mockUserID,
					mockPage,
					mockLimit
				)
			).rejects.toThrow('Database connection error');

			/**
			 * Assert called time
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
			expect(spyGetProductInWishlistPaging).toHaveBeenCalledTimes(1);
			expect(
				mockBuildPagingMetaService.calculateSkip
			).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemRepository.getAllWishlistItems
			).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemMapper.toProductInWishlistListResponseDto
			).not.toHaveBeenCalled();
			expect(
				mockBuildPagingMetaService.buildPagingResponse
			).not.toHaveBeenCalled();

			/**
			 * Assert called with
			 */
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining(`Error in \`getAllProductInWishlist\``),
				expect.any(String)
			);
		});
	});

	describe('addToWishlist', (): void => {
		const mockProductID: number = 1;
		const mockUserID: number = 1;
		const mockCurrentDate: Date = new Date();
		const mockWishlistItemEntity: WishlistItemEntity = {
			id: 1,
			product: { id: mockProductID } as ProductEntity,
			status: WishlistStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
			user: { id: mockUserID } as UserEntity,
		};
		const mockCreatedWishlistItem: WishlistItemEntity = {
			id: 1,
			product: { id: mockProductID } as ProductEntity,
			status: WishlistStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
			user: { id: mockUserID } as UserEntity,
		};

		it('should return true when add product to wishlist successfully', async (): Promise<void> => {
			/**
			 * Spy function called
			 */
			const spyGetProductInWishlistByProductIDAndUserID = jest.spyOn(
				mockWishlistService,
				'getProductInWishlistByProductIDAndUserID'
			);
			const spyAddToWishlist = jest.spyOn(
				mockWishlistService,
				'addToWishlist'
			);
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();

			/**
			 * Mock return and resolve data
			 */
			spyGetProductInWishlistByProductIDAndUserID.mockResolvedValueOnce(
				mockWishlistItemEntity
			);
			mockWishlistItemRepository.createWishlistItem.mockResolvedValueOnce(
				mockCreatedWishlistItem
			);

			/**
			 * Assert equal
			 */
			const result: boolean = await mockWishlistService.addToWishlist(
				mockProductID,
				mockUserID
			);
			expect(result).toBe(true);

			/**
			 * Assert called time
			 */
			expect(
				spyGetProductInWishlistByProductIDAndUserID
			).toHaveBeenCalledTimes(1);
			expect(spyAddToWishlist).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemRepository.createWishlistItem
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);

			/**
			 * Assert called with
			 */
			expect(
				spyGetProductInWishlistByProductIDAndUserID
			).toHaveBeenCalledWith(mockProductID, mockUserID);
			expect(spyAddToWishlist).toHaveBeenCalledWith(
				mockProductID,
				mockUserID
			);
			expect(
				mockWishlistItemRepository.createWishlistItem
			).toHaveBeenCalledWith(mockProductID, mockUserID);

			/**
			 * Assert not to have been called
			 */
			expect(spyLoggerDebug).not.toHaveBeenCalled();
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).not.toHaveBeenCalled();
		});

		it('should throw Internal Error Exception when no connection from database in getProductInWishlistByProductIDAndUserID function', async (): Promise<void> => {
			/**
			 * Spy function called
			 */
			const spyGetProductInWishlistByProductIDAndUserID = jest.spyOn(
				mockWishlistService,
				'getProductInWishlistByProductIDAndUserID'
			);
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();
			const spyAddToWishlist = jest.spyOn(
				mockWishlistService,
				'addToWishlist'
			);

			/**
			 * Mock error
			 */
			spyGetProductInWishlistByProductIDAndUserID.mockRejectedValueOnce(
				new Error('Database connection error')
			);

			/**
			 * Assert throw error
			 */
			await expect(
				mockWishlistService.addToWishlist(mockProductID, mockUserID)
			).rejects.toThrow('Database connection error');

			/**
			 * Assert called time
			 */
			expect(
				spyGetProductInWishlistByProductIDAndUserID
			).toHaveBeenCalledTimes(1);
			expect(spyAddToWishlist).toHaveBeenCalledTimes(1);
			expect(
				mockWishlistItemRepository.createWishlistItem
			).toHaveBeenCalledTimes(0);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);

			/**
			 * Assert called with
			 */
			expect(
				spyGetProductInWishlistByProductIDAndUserID
			).toHaveBeenCalledWith(mockProductID, mockUserID);
			expect(spyAddToWishlist).toHaveBeenCalledWith(
				mockProductID,
				mockUserID
			);
			expect(spyLoggerError.mock.calls[0][0]).toBe(
				'Error in `getAllProductInWishlist`: Database connection error'
			);

			/**
			 * Assert not to be called
			 */
			expect(
				mockWishlistItemRepository.createWishlistItem
			).not.toHaveBeenCalled();
			expect(spyLoggerDebug).not.toHaveBeenCalled();
			expect(spyLoggerWarn).not.toHaveBeenCalled();
		});
	});

	describe('getProductInWishlistByProductIDAndUserID', (): void => {
		const mockProductID: number = 1;
		const mockUserID: number = 1;
		const mockWishlistItemEntity: WishlistItemEntity = {
			id: 1,
			product: { id: mockProductID } as ProductEntity,
			status: WishlistStatusEnum.ACTIVE,
			createdAt: new Date(),
			updatedAt: new Date(),
			user: { id: mockUserID } as UserEntity,
		};

		it('should return WishlistItemEntity when dont have product in wishlist', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockWishlistItemRepository.getWishlistItemByProductIDAndUserID.mockResolvedValueOnce(
				null
			);

			/**
			 * Assert equal
			 */
			const result: WishlistItemEntity | null =
				await mockWishlistService.getProductInWishlistByProductIDAndUserID(
					mockProductID,
					mockUserID
				);
			expect(result).toEqual(null);

			/**
			 * Assert called time
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledTimes(1);

			/**
			 * Assert called with
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledWith(mockProductID, mockUserID);
		});

		it('should throw BadRequestException when product already in wishlist', async (): Promise<void> => {
			/**
			 * Mock return and resolved data
			 */
			mockWishlistItemRepository.getWishlistItemByProductIDAndUserID.mockResolvedValueOnce(
				mockWishlistItemEntity
			);

			/**
			 * Spy function called
			 */
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();

			/**
			 * Assert throw error
			 */
			await expect(
				mockWishlistService.getProductInWishlistByProductIDAndUserID(
					mockProductID,
					mockUserID
				)
			).rejects.toThrow(BadRequestException);

			/**
			 * Assert called time
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(1);

			/**
			 * Assert called with
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledWith(mockProductID, mockUserID);
			expect(spyLoggerWarn).toHaveBeenCalledWith(
				expect.stringContaining(`Product already in wishlist`)
			);
			expect(spyLoggerError.mock.calls[0][0]).toBe(
				`Error in \`getProductInWishlistByProductIDAndUserID\`: Product already in wishlist`
			);

			/**
			 * Assert not to be called
			 */
			expect(spyLoggerDebug).not.toHaveBeenCalled();
		});

		it('should throw Internal Error Exception when no connection from database in getProductInWishlistByProductIDAndUserID function', async (): Promise<void> => {
			/**
			 * Mock error
			 */
			mockWishlistItemRepository.getWishlistItemByProductIDAndUserID.mockRejectedValueOnce(
				new Error('Database connection error')
			);

			/**
			 * Spy function called
			 */
			const spyLoggerError = jest
				.spyOn(mockWishlistService['logger'], 'error')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(mockWishlistService['logger'], 'warn')
				.mockImplementation();
			const spyLoggerDebug = jest
				.spyOn(mockWishlistService['logger'], 'debug')
				.mockImplementation();

			/**
			 * Assert throw error
			 */
			await expect(
				mockWishlistService.getProductInWishlistByProductIDAndUserID(
					mockProductID,
					mockUserID
				)
			).rejects.toThrow('Database connection error');

			/**
			 * Assert called time
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(0);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(0);

			/**
			 * Assert called with
			 */
			expect(
				mockWishlistItemRepository.getWishlistItemByProductIDAndUserID
			).toHaveBeenCalledWith(mockProductID, mockUserID);
			expect(spyLoggerDebug).not.toHaveBeenCalled();
			expect(spyLoggerWarn).not.toHaveBeenCalled();
			expect(spyLoggerError).toHaveBeenCalledWith(
				expect.stringContaining(
					`Error in \`getProductInWishlistByProductIDAndUserID\``
				),
				expect.any(String)
			);

			/**
			 * Assert not to be called
			 */
			expect(spyLoggerDebug).not.toHaveBeenCalled();
			expect(spyLoggerWarn).not.toHaveBeenCalled();
		});
	});
});
