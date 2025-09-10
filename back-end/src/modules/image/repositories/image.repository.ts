/*
 * @description: image service
 * @author: Nhut Tan
 * @date: 2025-09-11
 * @version: 1.0.1
 * */

import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';
import { Repository } from 'typeorm';

export class ImageRepository {
  private readonly logger: Logger = new Logger(ImageRepository.name);

  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}


}
