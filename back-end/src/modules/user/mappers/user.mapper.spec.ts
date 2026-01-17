/**
 * @description Unit Test file for testing UserMapper class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { UserMapper } from './user.mapper';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../../role/entities/role.entity';
import { UserEntityResponseDto } from '../dtos/user-entity-response.dto';
import { UserStatus } from '../enums/user-status.enum';
import { RoleName } from '../../role/enums/role-name.enum';
import { CartEntity } from '../../cart/entities/cart.entity';
import { UserDetailEntity } from '../entities/user-detail.entity';
import { UserImageEntity } from '../../image/entities/user-image.entity';
import { OrderEntity } from '../../orders/entities/order.entity';
import { WishlistItemEntity } from '../../wishlist/entities/wishlist-item.entity';

describe('UserMapper', (): void => {
	let userMapper: UserMapper;

	beforeEach((): void => {
		userMapper = new UserMapper();
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('toUserResponseDto', (): void => {
		const mockCurrentDate: Date = new Date();
		const mockUserEntity: UserEntity = {
			id: 1,
			username: 'test',
			email: 'test',
			password: 'test',
			role: { name: RoleName.CUSTOMER } as RoleEntity,
			status: UserStatus.ACTIVE,
			cart: [] as CartEntity[],
			userDetail: {} as UserDetailEntity,
			userImages: [] as UserImageEntity[],
			fullName: 'user 1',
			order: [] as OrderEntity[],
			wishlistItems: [] as WishlistItemEntity[],
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as UserEntity;
		const mockUserResponseDto: UserEntityResponseDto = {
			id: 1,
			username: 'test',
			email: 'test',
			role: RoleName.CUSTOMER,
			status: UserStatus.ACTIVE.toString(),
			createdAt: mockCurrentDate.toString(),
			updatedAt: mockCurrentDate.toString(),
		} as UserEntityResponseDto;

		it('should return UserResponseDto when toUserResponseDto', (): void => {
			const spyToUserResponseDto = jest.spyOn(
				userMapper,
				'toUserResponseDto'
			);

			expect(userMapper.toUserResponseDto(mockUserEntity)).toEqual(
				mockUserResponseDto
			);

			expect(spyToUserResponseDto).toBeCalledWith(mockUserEntity);
			expect(spyToUserResponseDto).toHaveBeenCalledTimes(1);
		});
	});
});
