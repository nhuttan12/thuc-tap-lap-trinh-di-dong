/**
 * @description Unit Test file for testing GetProductDetailByProductIDRequestDto class
 * @author Nhut Tan
 * @since 2025-11-19
 * @version 1.0.0
 */

import { GetProductDetailByProductIdRequestDto } from './get-product-detail-by-product-id-request.dto';
import { validate, ValidationError } from '@nestjs/class-validator';
import { ProductStatusCode } from '../status-code/product.status-code';

describe('GetProductDetailByProductIdRequestDto', (): void => {
	let dto: GetProductDetailByProductIdRequestDto;

	beforeEach((): void => {
		dto = new GetProductDetailByProductIdRequestDto();
	});

	afterEach((): void => {
		jest.clearAllMocks();
	});

	it('should work when no error in validating', async (): Promise<void> => {
		dto.productID = 1;
		const error: ValidationError[] = await validate(dto);

		expect(error).toHaveLength(0);
	});

	it('should fail if productID is empty', async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.productID = '' as any;
		const error: ValidationError[] = await validate(dto);

		expect(error).toHaveLength(1);
		expect(error[0].property).toBe('productID');
		expect(error[0].constraints).toHaveProperty('isNotEmpty');
		expect(error[0].constraints?.isNotEmpty).toBe(
			ProductStatusCode.PRODUCT_ID_MUST_NOT_BE_EMPTY.customCode
		);
	});

	it('should fail if productID is not integer', async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		dto.productID = '1a' as any;

		const error: ValidationError[] = await validate(dto);

		expect(error).toHaveLength(1);
		expect(error[0].property).toBe('productID');
		expect(error[0].constraints).toHaveProperty('isInt');
		expect(error[0].constraints?.isInt).toBe(
			ProductStatusCode.PRODUCT_ID_MUST_BE_AN_INTEGER.customCode
		);
	});
});
