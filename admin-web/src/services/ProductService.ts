/**
 * @description Product service
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-18
 */

import { GetAllProductResponse } from '../types/products/GetAllProductResponse.ts';

export class ProductService {
	/**
	 * @description Get all product paging
	 * @returns {Promise<GetAllProductResponse[]>}
	 */
	async getAllProductPaging(): Promise<GetAllProductResponse[]> {
		return [];
	}
}

export const productService = new ProductService();