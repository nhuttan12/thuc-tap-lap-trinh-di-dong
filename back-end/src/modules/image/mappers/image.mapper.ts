/*
 * @description: mapper class used for convert a type to `JwtPayloadInterface`
 * @author: Nhut Tan
 * @date: 2025-09-10
 * @version: 1.0.0
 * */

import { ImageEntityResponse } from '../dtos/image-entity.response';
import { ImageEntity } from '../entities/image.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageMapper {
  toImageEntityResponse(image: ImageEntity): ImageEntityResponse {
    return {
      id: image.id,
      url: image.url,
      status: image.status,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}
