import { ImageStatusEnum } from '../enums/image-status.enum';

export class ImageEntityResponse {
  id: number;
  url: string;
  status: ImageStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
