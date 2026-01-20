/**
 * @description Checkout item response dto
 */
export class CheckoutItemResponseDto {
    cartDetailId: number;
    productId: number;
    name: string;
    imageUrl: string;
    price: number;
    discount: number;
    quantity: number;
    subTotal: number;
}
