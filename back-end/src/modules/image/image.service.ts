/*
 * @description: image service
 * @author: Nhut Tan
 * @date: 2025-09-11
 * @version: 1.0.1
 * */

import { Injectable, Logger } from '@nestjs/common';
import { ImageRepository } from './repositories/image.repository';

@Injectable()
export class ImageService {
  private readonly logger: Logger = new Logger(ImageService.name);

  constructor(private readonly imageRepository: ImageRepository) {}
}
