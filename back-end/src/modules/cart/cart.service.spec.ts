/**
 * @description Unit Test file for Testing functions in CartService file
 * @author Nhut Tan
 * @since 2025-10-10
 * @version 1.0.0
 */

import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart.repository';
import { CartDetailService } from './cart-detail.service';
import { CartMapper } from './mappers/cart.mapper';
import { Test, TestingModule } from '@nestjs/testing';
import { CartEntity } from './entities/cart.entity';
import { CartStatusEnum } from './enums/cart.status.enum';
import { UserEntity } from '../user/entities/user.entity';
import { CartResponseDto } from './dtos/cart-response.dto';
import { Logger } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { CartDetailEntity } from './entities/cart-detail.entity';
import { CartDetailResponseDto } from './dtos/cart-detail-response.dto';

describe('CartService', (): void => {
	let cartService: CartService;
	let cartRepository: jest.Mocked<CartRepository>;
	let cartDetailService: jest.Mocked<CartDetailService>;
	let cartMapper: jest.Mocked<CartMapper>;

	const mockCartRepository = {
		getActiveCartByUserID: jest.fn(),
		createCart: jest.fn(),
	};

	const mockCartDetailService = {
		createNewCartDetail: jest.fn(),
		deleteCartDetail: jest.fn(),
	};

	const mockCartMapper = {
		toCartResponseDto: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartService,
				{
					provide: CartRepository,
					useValue: mockCartRepository,
				},
				{
					provide: CartDetailService,
					useValue: mockCartDetailService,
				},
				{
					provide: CartMapper,
					useValue: mockCartMapper,
				},
			],
		}).compile();

		cartService = module.get<CartService>(CartService);
		cartRepository = module.get<CartRepository>(
			CartRepository
		) as jest.Mocked<CartRepository>;
		cartDetailService = module.get<CartDetailService>(
			CartDetailService
		) as jest.Mocked<CartDetailService>;
		cartMapper = module.get<CartMapper>(
			CartMapper
		) as jest.Mocked<CartMapper>;
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('addProductToCart', (): void => {
		const mockUserID: number = 1;
		const mockProductID: number = 1;
		const mockQuantity: number = 1;
		const mockProductName: string = 'Mock product';
		const mockProductImage: string = 'https://example.com/image.jpg';
		const mockPrice: number = 100000;
		const mockDiscount: number = 0;

		const mockDate: Date = new Date();

		const mockCartEntity: CartEntity = {
			id: 1,
			status: CartStatusEnum.ACTIVE,
			user: {
				id: 1,
			} as UserEntity,
			cartDetails: [],
			createdAt: mockDate,
			updatedAt: mockDate,
		};

		const mockCartResponse: CartResponseDto = {
			id: 1,
			status: CartStatusEnum.ACTIVE,
			userID: 1,
			cartDetails: [],
			createdAt: mockDate.toString(),
			updatedAt: mockDate.toString(),
		};

		it('should return CartResponseDto when having a cart', async (): Promise<void> => {
			cartRepository.getActiveCartByUserID
				.mockResolvedValueOnce(mockCartEntity)
				.mockResolvedValueOnce(mockCartEntity);
			cartMapper.toCartResponseDto.mockReturnValue(mockCartResponse);

			const loggerSpyDebug = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation((): void => {});
			const loggerSpyLog = jest
				.spyOn(Logger.prototype, 'log')
				.mockImplementation((): void => {});
			const loggerSpyError = jest
				.spyOn(Logger.prototype, 'error')
				.mockImplementation((): void => {});

			const result: CartResponseDto = await cartService.addProductToCart(
				mockUserID,
				mockProductID,
				mockQuantity
			);

			expect(cartRepository.getActiveCartByUserID).toHaveBeenCalledWith(
				mockUserID
			);
			expect(cartRepository.getActiveCartByUserID).toHaveBeenCalledTimes(
				2
			);

			expect(cartDetailService.createNewCartDetail).toHaveBeenCalledTimes(
				1
			);
			expect(cartDetailService.createNewCartDetail).toHaveBeenCalledWith(
				mockProductID,
				mockCartEntity.id,
				mockQuantity
			);

			expect(cartMapper.toCartResponseDto).toHaveBeenCalledTimes(1);
			expect(cartMapper.toCartResponseDto).toHaveBeenCalledWith(
				mockCartEntity
			);
			expect(result).toEqual(mockCartResponse);

			expect(loggerSpyLog).not.toHaveBeenCalled();
			expect(loggerSpyError).not.toHaveBeenCalled();
			expect(loggerSpyDebug).toHaveBeenCalled();
		});

		it('should return CartResponseDto when dont have cart', async (): Promise<void> => {
			const mockNewCartEntity: CartEntity = cloneDeep(mockCartEntity);
			const mockNewCartDetail: CartDetailResponseDto = {
				id: 1,
				quantity: 1,
				name: mockProductName,
				images: mockProductImage,
				discount: mockDiscount,
				price: mockPrice,
			};

			/**
			 * @description Mocking value resolved for function called
			 */
			cartRepository.getActiveCartByUserID
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce(mockCartEntity);
			cartRepository.createCart.mockResolvedValueOnce(mockNewCartEntity);
			cartDetailService.createNewCartDetail.mockResolvedValueOnce(
				mockNewCartDetail
			);

			/**
			 * @description Mocking logger spy called
			 */
			const loggerSpyDebug = jest
				.spyOn(Logger.prototype, 'debug')
				.mockImplementation((): void => {});
			const loggerSpyLog = jest
				.spyOn(Logger.prototype, 'log')
				.mockImplementation((): void => {});
			const loggerSpyError = jest
				.spyOn(Logger.prototype, 'error')
				.mockImplementation((): void => {});

			/**
			 * Call function addProductToCart
			 */
			const result: CartResponseDto = await cartService.addProductToCart(
				mockUserID,
				mockProductID,
				mockQuantity
			);

			/**
			 * Assert
			 */
			expect(cartRepository.getActiveCartByUserID).toHaveBeenCalledTimes(
				2
			);
			expect(cartRepository.createCart).toHaveBeenCalledTimes(mockUserID);
			expect(cartDetailService.createNewCartDetail).toHaveBeenCalledWith(
				mockProductID,
				mockNewCartDetail.id,
				mockQuantity
			);
			expect(result).toEqual(mockCartResponse);
			expect(loggerSpyLog).toHaveBeenCalledWith(
				`New cart entity created: ${JSON.stringify(newCartEntity)}`
			);
			expect(loggerSpyLog).toHaveBeenCalledTimes(1);
			expect(loggerSpyError).toHaveBeenCalledTimes(0);
			expect(loggerSpyDebug).toHaveBeenCalledTimes(2);
		});

		it('should throw ConflictException when cart not found after created if cart not exist', () => {
			
		});
	});
});
