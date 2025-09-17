/*
 * @description: Product entity response dto
 * @author: Nhut Tan
 * @date: 2025-09-15
 * @version: 1.0.0
 * */

export class ProductEntityResponseDto {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
