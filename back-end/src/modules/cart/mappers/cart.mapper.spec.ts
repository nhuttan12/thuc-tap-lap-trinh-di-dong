/**
 * @description Unit test for CartMapper class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { CartMapper } from './cart.mapper';
import { CartDetailMapper } from './cart-detail.mapper';
import { Test, TestingModule } from '@nestjs/testing';
import { CartResponseDto } from '../dtos/cart-response.dto';
import { CartStatusEnum } from '../enums/cart.status.enum';
import { CartEntity } from '../entities/cart.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { cloneDeep } from 'lodash';
import { CartDetailResponseDto } from '../dtos/cart-detail-response.dto';
import { CartDetailEntity } from '../entities/cart-detail.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { CartDetailsStatusEnum } from '../enums/cart-details-status.enum';

describe('CartMapper', (): void => {
	let cartMapper: CartMapper;
	let cartDetailMapper: jest.Mocked<CartDetailMapper>;

	const mockingCartDetailMapper = {
		toCartDetailsResponseDto: jest.fn(),
		toCartDetailResponseDto: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartMapper,
				{
					provide: CartDetailMapper,
					useValue: mockingCartDetailMapper,
				},
			],
		}).compile();

		cartMapper = module.get<CartMapper>(CartMapper);
		cartDetailMapper = module.get<CartDetailMapper>(
			CartDetailMapper
		) as jest.Mocked<CartDetailMapper>;
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	/**
	 * @description Create mocking variable
	 */
	const currentTime: string = new Date().toString();
	const currentDate: Date = new Date();

	const cartResponseDto: CartResponseDto = {
		id: 1,
		status: CartStatusEnum.ACTIVE,
		userID: 1,
		cartDetails: [],
		createdAt: currentTime,
		updatedAt: currentTime,
	};

	const cartEntity: CartEntity = {
		id: 1,
		status: CartStatusEnum.ACTIVE,
		user: {
			id: 1,
		} as UserEntity,
		cartDetails: [],
		createdAt: currentDate,
		updatedAt: currentDate,
	};

	const cartDetailResponseDto: CartDetailResponseDto = {
		id: 1,
		imageUrl: 'https://mocking-image.jpg',
		name: 'Product 1',
		price: 100000,
		quantity: 1,
		discount: 0,
	};

	const cartDetailEntity: CartDetailEntity = {
		id: 1,
		cart: {} as CartEntity,
		product: {
			name: 'Product 1',
			price: 100000,
			discount: 0,
		} as ProductEntity,
		quantity: 1,
		status: CartDetailsStatusEnum.ACTIVE,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	/**
	 * @description Test mapping CartEntity to CartResponseDto
	 */
	it('should mapping CartEntity to CartResponseDto correctly', (): void => {
		const cartMapping: CartResponseDto =
			cartMapper.toCartResponseDto(cartEntity);

		cartDetailMapper.toCartDetailResponseDto.mockReturnValue(
			cartDetailResponseDto
		);

		const cartDetailMapping: CartDetailResponseDto =
			cartDetailMapper.toCartDetailResponseDto(cartDetailEntity);

		expect(cartDetailMapping).toEqual(cartDetailResponseDto);
		expect(cartDetailMapper.toCartDetailResponseDto).toHaveBeenCalledTimes(
			1
		);
		expect(cartDetailMapper.toCartDetailResponseDto).toHaveBeenCalledWith(
			cartDetailEntity
		);

		expect(cartMapping).toEqual(cartResponseDto);
	});

	/**
	 * @description Test mapping CartEntity to CartResponseDto not mutate the original CartEntity object
	 */
	it('should not mutate the original CartEntity after mapping', (): void => {
		const originalCopy: CartEntity = cloneDeep(cartEntity);

		cartMapper.toCartResponseDto(cartEntity);

		expect(cartEntity).toEqual(originalCopy);
	});
});
