/*
 * @description image service
 * @author Nhut Tan
 * @since 2025-09-11
 * @modifies 2025-09-23
 * @version 1.0.2
 */

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ImageStatusEnum } from '../enums/image-status.enum';

export class ImageRepository {
  private readonly logger: Logger = new Logger(ImageRepository.name);

  /*
   * @description constructor of image repository class
   * @author Nhut Tan
   * @since 2025-09-12
   * @version 1.0.0
   */
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /*
   * @description Create image
   * @param {imageUrl: string, userID: number}
   * @return {ImageEntity}
   * @author Nhut Tan
   * @since 2025-09-12
   * @version 1.0.0
   */
  async createImage(imageUrl: string, userID: number): Promise<ImageEntity> {
    try {
      return await this.dataSource.transaction(
        async (tx: EntityManager): Promise<ImageEntity> => {
          /*
           * Use transaction to ensure data consistency
           */
          const imageEntity: ImageEntity = tx.create(ImageEntity, {
            url: imageUrl,
            status: ImageStatusEnum.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
            userImage: {
              user: {
                id: userID,
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          this.logger.debug(`Created image: ${JSON.stringify(imageEntity)}`);

          /*
           * Save image to database
           */
          return await tx.save(imageEntity);
        },
      );
    } catch (e) {
      this.logger.error(
        `Error in \`createImage\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }

  /**
   * @description Get image by url
   * @param: {url}
   * @return {ImageEntity | null}
   * @author Nhut Tan
   * @since 2025-09-23
   * @version 1.0.0
   */
  async getImageByUrl(url: string): Promise<ImageEntity | null> {
    try {
      return await this.imageRepository.findOne({
        where: {
          url,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (e) {
      this.logger.error(
        `Error in \`getImageByUrl\`: ${(e as Error).message}`,
        (e as Error).stack,
      );
      throw e;
    }
  }
}
