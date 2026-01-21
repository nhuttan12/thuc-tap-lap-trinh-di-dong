import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class OrderItemResponseDto {
    @ApiProperty({ description: 'ID chi tiết đơn hàng' })
    id: number;

    @ApiProperty({ description: 'ID sản phẩm' })
    productId: number | undefined;

    @ApiProperty({ description: 'Tên sản phẩm' })
    productName: string | undefined;

    @ApiProperty({ description: 'Số lượng' })
    quantity: number;

    @ApiProperty({ description: 'Giá' })
    price: number;

    @ApiProperty({ description: 'Thành tiền' })
    total: number;
}

export class OrderResponseDto {
    @ApiProperty({ description: 'ID đơn hàng' })
    id: number;

    @ApiProperty({ description: 'ID người dùng' })
    userId: number | undefined;

    @ApiProperty({ description: 'Tên người dùng' })
    username: string | undefined;

    @ApiProperty({ description: 'Họ tên người dùng' })
    fullName: string | undefined;

    @ApiProperty({ description: 'Email người dùng' })
    email: string | undefined;

    @ApiProperty({ description: 'Tổng tiền' })
    price: number;

    @ApiProperty({ description: 'Trạng thái', enum: OrderStatusEnum })
    status: OrderStatusEnum;

    @ApiProperty({ description: 'Ngày tạo' })
    createdAt: Date;

    @ApiProperty({ description: 'Ngày cập nhật' })
    updatedAt: Date;

    @ApiProperty({ type: [OrderItemResponseDto], description: 'Chi tiết đơn hàng' })
    items: OrderItemResponseDto[];
}