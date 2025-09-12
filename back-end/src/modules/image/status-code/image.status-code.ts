import { HttpStatus } from '@nestjs/common';

export class ImageStatusCode {
  static readonly IMAGE_NOT_FOUND: ImageStatusCode = new ImageStatusCode(
    HttpStatus.NOT_FOUND,
    'USR_001',
    'Image not found',
  );

  public constructor(
    public readonly statusCode: number,
    public readonly customCode: string,
    public readonly message: string,
  ) {}
}
