/**
 * @description image service
 * @author Nhut Tan
 * @since 2025-09-11
 * @version 1.0.1
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ImageRepository } from './repositories/image.repository';
import { ImageEntity } from './entities/image.entity';
import { ImageStatusCode } from './status-code/image.status-code';
import { ImageMapper } from './mappers/image.mapper';
import { ImageEntityResponse } from './dtos/image-entity.response';

@Injectable()
export class ImageService {
  private readonly logger: Logger = new Logger(ImageService.name);

  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly imageMapper: ImageMapper,
  ) {}

  /*
   * @description Create image
   * @param {imageUrl: string, userID: number}
   * @return {ImageEntity}
   * @author Nhut Tan
   * @since 2025-09-12
   * @version 1.0.0
   */
  async createImage(
    imageUrl: string,
    userID: number,
  ): Promise<ImageEntityResponse> {
    /*
     * Call `createImage` in `ImageRepository`
     */
    const imageEntity: ImageEntity = await this.imageRepository.createImage(
      imageUrl,
      userID,
    );
    this.logger.debug(
      `Call \`createImage\` in \`ImageRepository\`: ${JSON.stringify(imageEntity)}`,
    );

    /*
     * Check image existence
     */
    if (!imageEntity) {
      this.logger.error(
        `Image with url: ${imageUrl} and userID: ${userID} not found after created`,
      );
      throw new BadRequestException({
        statusCode: ImageStatusCode.IMAGE_NOT_FOUND.statusCode,
        customCode: ImageStatusCode.IMAGE_NOT_FOUND.customCode,
        message: ImageStatusCode.IMAGE_NOT_FOUND.message,
      });
    }

    /*
     * Mapping image entity to image response dto
     */
    const imageResponseDto: ImageEntityResponse =
      this.imageMapper.toImageEntityResponse(imageEntity);

    return imageResponseDto;
  }

  /**
   * @description Get image by url
   * @param url
   * @return {ImageEntityResponse}
   * @author Nhut Tan
   * @since 2025-09-23
   * @version 1.0.0
   */
  async getImageByUrl(url: string): Promise<ImageEntityResponse> {
    /**
     * Call `getImageByUrl` in `ImageRepository`
     */
    const imageEntity: ImageEntity | null =
      await this.imageRepository.getImageByUrl(url);

    /**
     * Check image exist
     */
    if (!imageEntity) {
      this.logger.error(`Image with url: ${url} not found`);
      throw new BadRequestException({
        statusCode: ImageStatusCode.IMAGE_NOT_FOUND.statusCode,
        customCode: ImageStatusCode.IMAGE_NOT_FOUND.customCode,
        message: ImageStatusCode.IMAGE_NOT_FOUND.message,
      });
    }

    /**
     * Mapping image entity to image response dto
     */
    const imageResponseDto: ImageEntityResponse =
      this.imageMapper.toImageEntityResponse(imageEntity);

    return imageResponseDto;
  }
}
