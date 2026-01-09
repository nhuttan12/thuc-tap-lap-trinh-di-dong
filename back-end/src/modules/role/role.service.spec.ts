/**
 * @description Unit Test file for testing RoleService class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { RoleService } from './role.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RoleRepository } from './repositories/role.repository';
import { RoleMapper } from './mappers/role.mapper';
import { RoleName } from './enums/role-name.enum';
import { RoleResponseDto } from './dtos/role-response.dto';
import { RoleStatus } from './enums/role-status.enum';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('RoleService', (): void => {
	let roleService: RoleService;

	const mockRoleRepository = {
		createRole: jest.fn(),
		getRoleByName: jest.fn(),
	};

	const mockRoleMapper = {
		toRoleResponseDto: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleService,
				{
					provide: RoleRepository,
					useValue: mockRoleRepository,
				},
				{
					provide: RoleMapper,
					useValue: mockRoleMapper,
				},
			],
		}).compile();

		roleService = module.get<RoleService>(RoleService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('getRoleByName', (): void => {
		const mockRoleName: string = RoleName.CUSTOMER;
		const mockCurrentDate: Date = new Date();
		const mockRoleResponseDto: RoleResponseDto = {
			id: 1,
			name: mockRoleName,
			status: RoleStatus.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};
		const mockRoleEntity: RoleEntity = {
			id: 1,
			name: mockRoleName,
			status: RoleStatus.ACTIVE,
			user: {} as UserEntity,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as unknown as RoleEntity;

		it('should return RoleResponseDto when getRoleByName', async (): Promise<void> => {
			/**
			 * Mock data return and resolve
			 */
			mockRoleRepository.getRoleByName.mockResolvedValueOnce(
				mockRoleEntity
			);
			mockRoleMapper.toRoleResponseDto.mockReturnValueOnce(
				mockRoleResponseDto
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(roleService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(roleService['logger'], 'warn')
				.mockImplementation();
			const spyGetRoleByName = jest.spyOn(roleService, 'getRoleByName');

			/**
			 * Assert equal
			 */
			await expect(
				roleService.getRoleByName(mockRoleName)
			).resolves.toEqual(mockRoleResponseDto);

			/**
			 * Assert call with
			 */
			expect(spyGetRoleByName).toHaveBeenCalledWith(mockRoleName);
			expect(mockRoleRepository.getRoleByName).toHaveBeenCalledWith(
				mockRoleName
			);
			expect(mockRoleMapper.toRoleResponseDto).toHaveBeenCalledWith(
				mockRoleEntity
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getRoleByName\` function from repository: ${JSON.stringify(mockRoleEntity, null, 2)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Call \`toRoleResponseDto\` function from mapper: ${JSON.stringify(mockRoleResponseDto, null, 2)}`
			);
			expect(spyLoggerWarn).not.toHaveBeenCalledWith(
				`Role with name ${mockRoleName} not found`
			);

			/**
			 * Assert call time
			 */
			expect(mockRoleRepository.getRoleByName).toHaveBeenCalledTimes(1);
			expect(mockRoleMapper.toRoleResponseDto).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerWarn).not.toHaveBeenCalled();
		});

		it('should throw NotFoundException if role is null', async (): Promise<void> => {
			/**
			 * Mock data return and resolve
			 */
			mockRoleRepository.getRoleByName.mockResolvedValueOnce(null);
			mockRoleMapper.toRoleResponseDto.mockReturnValueOnce(
				mockRoleResponseDto
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(roleService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerWarn = jest
				.spyOn(roleService['logger'], 'warn')
				.mockImplementation();
			const spyGetRoleByName = jest.spyOn(roleService, 'getRoleByName');

			/**
			 * Assert throw
			 */
			await expect(
				roleService.getRoleByName(mockRoleName)
			).rejects.toThrow(NotFoundException);

			/**
			 * Assert call with
			 */
			expect(spyGetRoleByName).toHaveBeenCalledWith(mockRoleName);
			expect(mockRoleRepository.getRoleByName).toHaveBeenCalledWith(
				mockRoleName
			);
			expect(mockRoleMapper.toRoleResponseDto).not.toHaveBeenCalledWith(
				mockRoleEntity
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getRoleByName\` function from repository: ${null}`
			);
			expect(spyLoggerDebug).not.toHaveBeenNthCalledWith(
				2,
				`Call \`toRoleResponseDto\` function from mapper: ${undefined}`
			);
			expect(spyLoggerWarn).toHaveBeenCalledWith(
				`Role with name ${mockRoleName} not found`
			);

			/**
			 * Assert call time
			 */
			expect(mockRoleRepository.getRoleByName).toHaveBeenCalledTimes(1);
			expect(mockRoleMapper.toRoleResponseDto).not.toHaveBeenCalled();
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerWarn).toHaveBeenCalledTimes(1);
		});
	});
});
