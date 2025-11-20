/**
 * @description Unit Test file for testing Image Service class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { ImageService } from './image.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageRepository } from './repositories/image.repository';
import { ImageMapper } from './mappers/image.mapper';
import { ImageEntity } from './entities/image.entity';
import { ImageStatusEnum } from './enums/image-status.enum';
import { ImageEntityResponse } from './dtos/image-entity.response';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ImageService', (): void => {
	let imageService: ImageService;

	const mockImageRepository = {
		createImage: jest.fn(),
		getImageByUrl: jest.fn(),
	};

	const mockImageMapper = {
		toImageEntityResponse: jest.fn(),
	};

	beforeEach(async (): Promise<void> => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ImageService,
				{
					provide: ImageRepository,
					useValue: mockImageRepository,
				},
				{
					provide: ImageMapper,
					useValue: mockImageMapper,
				},
			],
		}).compile();

		imageService = module.get<ImageService>(ImageService);
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	describe('createImage', (): void => {
		const mockCurrentDate: Date = new Date();
		const mockImageUrl: string = 'https://sample_image.com.vn';
		const mockUserID: number = 1;
		const mockImageEntity: ImageEntity = {
			id: 1,
			url: mockImageUrl,
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as ImageEntity;
		const mockImageResponse: ImageEntityResponse = {
			id: 1,
			url: mockImageUrl,
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};

		it('should return ImageEntityResponse when creating image', async (): Promise<void> => {
			/**
			 * Mocking value
			 */
			mockImageRepository.createImage.mockResolvedValueOnce(
				mockImageEntity
			);
			mockImageMapper.toImageEntityResponse.mockReturnValueOnce(
				mockImageResponse
			);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(imageService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(imageService['logger'], 'error')
				.mockImplementation();
			const mockCreateImage = jest.spyOn(imageService, 'createImage');

			/**
			 * Assert
			 */
			await expect(
				imageService.createImage(mockImageUrl, mockUserID)
			).resolves.toEqual(mockImageResponse);
			expect(mockCreateImage).toHaveBeenCalledTimes(1);
			expect(mockCreateImage).toHaveBeenCalledWith(
				mockImageUrl,
				mockUserID
			);
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);
			expect(spyLoggerDebug).toHaveBeenCalledWith(
				`Call \`createImage\` in \`ImageRepository\`: ${JSON.stringify(mockImageEntity)}`
			);
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledWith(
				mockImageEntity
			);
			expect(mockImageRepository.createImage).toHaveBeenCalledTimes(1);
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledTimes(
				1
			);
		});

		it('should throw ConflictException when image is not found after created', async (): Promise<void> => {
			/**
			 * Mocking value
			 */
			mockImageRepository.createImage.mockResolvedValueOnce(null);

			/**
			 * Spy function call
			 */
			const spyLoggerDebug = jest
				.spyOn(imageService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(imageService['logger'], 'error')
				.mockImplementation();
			const mockCreateImage = jest.spyOn(imageService, 'createImage');

			/**
			 * Assert
			 */
			await expect(
				imageService.createImage(mockImageUrl, mockUserID)
			).rejects.toThrowError(ConflictException);
			expect(mockCreateImage).toHaveBeenCalledTimes(1);

			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`createImage\` in \`ImageRepository\`: ${null}`
			);
			expect(spyLoggerError).toHaveBeenCalledWith(
				`Image with url: ${mockImageUrl} and userID: ${mockUserID} not found after created`
			);

			expect(mockCreateImage).toHaveBeenCalledWith(
				mockImageUrl,
				mockUserID
			);
			expect(mockImageRepository.createImage).toHaveBeenCalledTimes(1);
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledTimes(
				0
			);
		});
	});

	describe('getImageByUrl', (): void => {
		const mockCurrentDate: Date = new Date();
		const mockImageUrl: string = 'https://sample_image.com.vn';
		const mockImageEntity: ImageEntity = {
			id: 1,
			url: mockImageUrl,
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as ImageEntity;
		const mockImageResponse: ImageEntityResponse = {
			id: 1,
			url: mockImageUrl,
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		};

		it('should return ImageEntityResponse when get image by url', async (): Promise<void> => {
			/**
			 * Mock resolve data
			 */
			mockImageRepository.getImageByUrl.mockResolvedValueOnce(
				mockImageEntity
			);
			mockImageMapper.toImageEntityResponse.mockReturnValueOnce(
				mockImageResponse
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(imageService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(imageService['logger'], 'error')
				.mockImplementation();
			const spyGetImageByUrl = jest.spyOn(imageService, 'getImageByUrl');

			/**
			 * Assert
			 */
			await expect(
				imageService.getImageByUrl(mockImageUrl)
			).resolves.toEqual(mockImageResponse);

			/**
			 * Assert spyGetImageByUrl
			 */
			expect(spyGetImageByUrl).toHaveBeenCalledTimes(1);
			expect(spyGetImageByUrl).toHaveBeenCalledWith(mockImageUrl);

			/**
			 * Assert logger
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(2);
			expect(spyLoggerError).toHaveBeenCalledTimes(0);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				1,
				`Call \`getImageByUrl\` in \`ImageRepository\`: ${JSON.stringify(mockImageEntity)}`
			);
			expect(spyLoggerDebug).toHaveBeenNthCalledWith(
				2,
				`Mapping image entity to image response dto: ${JSON.stringify(mockImageResponse)}`
			);

			/**
			 * Assert imageMapper
			 */
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledWith(
				mockImageEntity
			);
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledTimes(
				1
			);

			/**
			 * Assert imageRepository
			 */
			expect(mockImageRepository.getImageByUrl).toHaveBeenCalledTimes(1);
			expect(mockImageRepository.getImageByUrl).toHaveBeenCalledWith(
				mockImageUrl
			);
		});

		it('should throw NotFoundException when find no image after get image by url', async (): Promise<void> => {
			/**
			 * Mock resolve data
			 */
			mockImageRepository.getImageByUrl.mockResolvedValueOnce(null);
			mockImageMapper.toImageEntityResponse.mockReturnValueOnce(
				undefined
			);

			/**
			 * Spy function called
			 */
			const spyLoggerDebug = jest
				.spyOn(imageService['logger'], 'debug')
				.mockImplementation();
			const spyLoggerError = jest
				.spyOn(imageService['logger'], 'error')
				.mockImplementation();
			const mockGetImageByUrl = jest.spyOn(imageService, 'getImageByUrl');

			/**
			 * Assert
			 */
			await expect(
				imageService.getImageByUrl(mockImageUrl)
			).rejects.toThrowError(NotFoundException);

			/**
			 * Assert mockGetImageByUrl
			 */
			expect(mockGetImageByUrl).toHaveBeenCalledTimes(1);
			expect(mockGetImageByUrl).toHaveBeenCalledWith(mockImageUrl);

			/**
			 * Assert logger
			 */
			expect(spyLoggerDebug).toHaveBeenCalledTimes(1);
			expect(spyLoggerError).toHaveBeenCalledTimes(1);
			expect(spyLoggerDebug).toHaveBeenCalledWith(
				`Call \`getImageByUrl\` in \`ImageRepository\`: ${null}`
			);
			expect(spyLoggerError).toHaveBeenCalledWith(
				`Image with url: ${mockImageUrl} not found`
			);

			/**
			 * Assert imageMapper
			 */
			expect(mockImageMapper.toImageEntityResponse).toHaveBeenCalledTimes(
				0
			);

			/**
			 * Assert imageRepository
			 */
			expect(mockImageRepository.getImageByUrl).toHaveBeenCalledTimes(1);
			expect(mockImageRepository.getImageByUrl).toHaveBeenCalledWith(
				mockImageUrl
			);
		});
	});
});
