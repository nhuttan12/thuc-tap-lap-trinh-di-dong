/*
 * @description: image status code
 * @author: Nhut Tan
 * @date: 2025-09-12
 * @version: 1.0.0
 * */

import { HttpStatus } from '@nestjs/common';
import { BaseStatusCode } from '../../../common/status-code/base.status-code';

export class ImageStatusCode extends BaseStatusCode {
  static readonly IMAGE_NOT_FOUND: ImageStatusCode = new ImageStatusCode(
    HttpStatus.NOT_FOUND,
    'IMG_001',
    'Image not found',
  );
}
