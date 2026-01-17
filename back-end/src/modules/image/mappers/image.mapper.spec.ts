/**
 * @description Unit Test file for testing Image Mapper class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { ImageEntityResponse } from '../dtos/image-entity.response';
import { ImageEntity } from '../entities/image.entity';
import { ImageStatusEnum } from '../enums/image-status.enum';
import { ImageMapper } from './image.mapper';

describe('ImageMapper', (): void => {
	let imageMapper: ImageMapper;

	beforeEach((): void => {
		imageMapper = new ImageMapper();
	});

	describe('toImageEntityResponse', (): void => {
		/**
		 * @description Mocking value
		 */
		const mockCurrentDate: Date = new Date();
		const mockImage: ImageEntity = {
			id: 1,
			url: 'https://nhuttan.com',
			status: ImageStatusEnum.ACTIVE,
			createdAt: mockCurrentDate,
			updatedAt: mockCurrentDate,
		} as ImageEntity;
		const mockImageEntityResponse: ImageEntityResponse = {
			id: mockImage.id,
			url: mockImage.url,
			status: mockImage.status,
			createdAt: mockImage.createdAt,
			updatedAt: mockImage.updatedAt,
		};

		it('should return ImageEntityResponse when mapping', (): void => {
			/**
			 * Spy function called
			 */
			const spyToImageEntityResponse = jest.spyOn(
				imageMapper,
				'toImageEntityResponse'
			);

			/**
			 * Assert
			 */
			expect(imageMapper.toImageEntityResponse(mockImage)).toEqual(
				mockImageEntityResponse
			);
			expect(spyToImageEntityResponse).toHaveBeenCalledTimes(1);
			expect(spyToImageEntityResponse).toHaveBeenCalledWith(mockImage);
		});
	});
});
