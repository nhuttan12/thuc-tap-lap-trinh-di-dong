/**
 * @description Zustand store for products
 * @author @nhuttan12
 * @version 1.0.0
 * @since 2025-11-18
 */

import { GetAllProductResponse } from '../types/products/GetAllProductResponse.ts';
import { productService } from '../services/ProductService.ts';
import { create, StoreApi, UseBoundStore } from 'zustand';

interface ProductStore {
	products: GetAllProductResponse[];
	loading: boolean;
	getAllProductPaging: () => Promise<void>;
}

export const useProductStore: UseBoundStore<StoreApi<ProductStore>> =
	create<ProductStore>((set) => ({
		products: [],
		loading: false,
		getAllProductPaging: async (): Promise<void> => {
			set({ loading: true });
			try {
				const response: GetAllProductResponse[] =
					await productService.getAllProductPaging();

				set({ products: response });
			} catch (error) {
				console.log(error);
			} finally {
				set({ loading: false });
			}
		},
	}));
