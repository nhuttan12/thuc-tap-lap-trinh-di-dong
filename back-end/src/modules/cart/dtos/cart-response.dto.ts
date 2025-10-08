/**
 * @description Cart response dto
 * @author Nhut Tan
 * @since 2025-09-25
 * @version 1.0.0
 */

import { CartDetailResponseDto } from './cart-detail-response.dto';

export class CartResponseDto {
	id: number;
	userID: number;
	status: string;
	createdAt: string;
	updatedAt: string;
	cartDetails: CartDetailResponseDto[];
}
