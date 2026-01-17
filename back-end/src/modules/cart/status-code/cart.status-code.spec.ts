/**
 * @description Unit Test CartStatusCode
 * @author Nhut Tan
 * @since 2025-10-09
 * @version 1.0.0
 */

import { CartStatusCode } from './cart.status-code';

describe('CartStatusCode', (): void => {
	it('should create CART_NOT_FOUND with correct values', (): void => {
		const code = CartStatusCode.CART_NOT_FOUND;
		expect(code.message).toBe('Cart not found');
		expect(code.customCode).toBe('CART_001');
		expect(code.statusCode).toBe(404);
	});

	it('should create PRODUCT_ID_MUST_BE_INTEGER with correct values', (): void => {
		const code = CartStatusCode.PRODUCT_ID_MUST_BE_INTEGER;
		expect(code.message).toBe('Product ID must be integer');
		expect(code.customCode).toBe('CART_002');
		expect(code.statusCode).toBe(400);
	});

	it('should create PRODUCT_ID_MUST_NOT_BE_EMPTY with correct values', (): void => {
		const code = CartStatusCode.PRODUCT_ID_MUST_NOT_BE_EMPTY;
		expect(code.message).toBe('Product ID must not be empty');
		expect(code.customCode).toBe('CART_003');
		expect(code.statusCode).toBe(400);
	});

	it('should create PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER with correct values', (): void => {
		const code = CartStatusCode.PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER;
		expect(code.message).toBe('Product ID must be a positive number');
		expect(code.customCode).toBe('CART_004');
		expect(code.statusCode).toBe(400);
	});

	it('should create QUANTITY_MUST_BE_INTEGER with correct values', (): void => {
		const code = CartStatusCode.QUANTITY_MUST_BE_INTEGER;
		expect(code.message).toBe('Quantity must be integer');
		expect(code.customCode).toBe('CART_005');
		expect(code.statusCode).toBe(400);
	});

	it('should create QUANTITY_MUST_NOT_BE_EMPTY with correct values', (): void => {
		const code = CartStatusCode.QUANTITY_MUST_NOT_BE_EMPTY;
		expect(code.message).toBe('Quantity must not be empty');
		expect(code.customCode).toBe('CART_006');
		expect(code.statusCode).toBe(400);
	});

	it('should create QUANTITY_MUST_BE_A_POSITIVE_NUMBER with correct values', (): void => {
		const code = CartStatusCode.QUANTITY_MUST_BE_A_POSITIVE_NUMBER;
		expect(code.message).toBe('Quantity must be a positive number');
		expect(code.customCode).toBe('CART_007');
		expect(code.statusCode).toBe(400);
	});

	it('should create ADD_PRODUCT_TO_CART_SUCCESS with correct values', (): void => {
		const code = CartStatusCode.ADD_PRODUCT_TO_CART_SUCCESS;
		expect(code.message).toBe('Add product to cart success');
		expect(code.customCode).toBe('CART_008');
		expect(code.statusCode).toBe(200);
	});
});
