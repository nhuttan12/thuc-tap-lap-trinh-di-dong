/*
 * @description: user dto
 * @author: Nhut Tan
 * @date: 2025-09-08
 * @version: 1.0.0
 * */

import { TimestampResponseDto } from '../../../common/database/dtos/timestamp.response.dto';

export class UserResponseDto extends TimestampResponseDto {
  id: number;
  username: string;
  password: string;
  email: string;
  status: string;
  role: string;
}
