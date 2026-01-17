/**
 * @description Get all order response
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-12
 */

export interface GetAllOrderResponse {
	id: number;
	image: string;
	name: string;
	price: number;
	discount: number;
	color: string;
	rating: number;
	size: string[];
	description: string;
}
