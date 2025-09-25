/*
 * @description user dto
 * @author Nhut Tan
 * @since 2025-09-08
 * @version 1.0.0
 */

import { TimestampResponseDto } from '../../../common/database/dtos/timestamp.response.dto';

export class UserEntityResponseDto extends TimestampResponseDto {
  id: number;
  username: string;
  email: string;
  status: string;
  role: string;
}
