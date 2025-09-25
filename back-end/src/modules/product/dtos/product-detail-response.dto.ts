/**
 * @description Product detail response dto
 * @author Nhut Tan
 * @since 2025-09-24
 * @version 1.0.0
 */

export class ProductDetailResponseDto {
  id: number;
  imageList: string[];
  name: string;
  price: number;
  discount: number;
  color: string;
  rating: number;
  size: string[];
  description: string;
}
