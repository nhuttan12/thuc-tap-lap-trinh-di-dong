/**
 * @description Get product detail by product ID request dto
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */
import { IsInt } from '@nestjs/class-validator';
import { ProductStatusCode } from '../status-code/product.status-code';

export class GetProductDetailByProductIdRequestDto {
  @IsInt({
    message: ProductStatusCode.PRODUCT_ID_MUST_BE_AN_INTEGER.customCode,
  })
  productID: number;
}
