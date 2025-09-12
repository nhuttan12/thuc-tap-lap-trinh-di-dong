import { ImageStatusEnum } from '../enums/image-status.enum';

export class UserImageEntityResponse {
  id: number;
  url: string;
  status: ImageStatusEnum;
  createAt: Date;
  updateAt: Date;
}
