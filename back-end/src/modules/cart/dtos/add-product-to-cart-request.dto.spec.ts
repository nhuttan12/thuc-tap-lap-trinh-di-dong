/**
 * @description Unit test for Add Product To Cart Request Dto class
 * @author Nhut Tan
 * @since 2025-10-08
 * @version 1.0.0
 */

import { AddProductToCartRequestDto } from './add-product-to-cart-request.dto';
import { validate, ValidationError } from '@nestjs/class-validator';
import { CartStatusCode } from '../status-code/cart.status-code';

describe('AddProductToCartRequestDto', (): void => {
	let dto: AddProductToCartRequestDto;

	beforeEach((): void => {
		dto = new AddProductToCartRequestDto();
	});

	it('should fail if productID and quantity is not empty', async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.productID = '' as any;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.quantity = '' as any;

		const error: ValidationError[] = await validate(dto);

		expect(error.length).toBeGreaterThan(0);
		expect(error[0].constraints?.isNotEmpty).toBe(
			CartStatusCode.PRODUCT_ID_MUST_NOT_BE_EMPTY.customCode
		);
		expect(error[1].constraints?.isNotEmpty).toBe(
			CartStatusCode.QUANTITY_MUST_NOT_BE_EMPTY.customCode
		);
	});

	it('should fail if productID, quantity is not a integer', async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.productID = 'asd' as any;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.quantity = 'asd' as any;

		const error: ValidationError[] = await validate(dto);

		expect(error.length).toBeGreaterThan(0);
		expect(error[0].constraints?.isInt).toBe(
			CartStatusCode.PRODUCT_ID_MUST_BE_INTEGER.customCode
		);
		expect(error[1].constraints?.isInt).toBe(
			CartStatusCode.QUANTITY_MUST_BE_INTEGER.customCode
		);
	});

	it('should fail if productID, quantity is less than 1', async (): Promise<void> => {
		dto.productID = 0;
		dto.quantity = 0;

		const error: ValidationError[] = await validate(dto);

		expect(error.length).toBeGreaterThan(0);
		expect(error[0].constraints?.min).toBe(
			CartStatusCode.PRODUCT_ID_MUST_BE_A_POSITIVE_NUMBER.customCode
		);
		expect(error[1].constraints?.min).toBe(
			CartStatusCode.QUANTITY_MUST_BE_A_POSITIVE_NUMBER.customCode
		);
	});

	it('should pass if productID, quantity valid', async (): Promise<void> => {
		dto.productID = 1;
		dto.quantity = 1;

		const error: ValidationError[] = await validate(dto);

		expect(error.length).toBe(0);
	});
});
