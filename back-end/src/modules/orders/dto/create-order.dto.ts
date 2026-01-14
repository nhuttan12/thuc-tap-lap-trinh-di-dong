import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class CreateOrderItemDto {
    @ApiProperty({ description: 'ID sản phẩm' })
    @IsInt()
    @IsPositive()
    productId: number;

    @ApiProperty({ description: 'Số lượng' })
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ description: 'Giá' })
    @IsInt()
    @IsPositive()
    price: number;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'ID người dùng' })
    @IsInt()
    @IsPositive()
    userId: number;

    @ApiProperty({ description: 'Tổng tiền' })
    @IsInt()
    @IsPositive()
    price: number;

    @ApiProperty({ description: 'Trạng thái đơn hàng', enum: OrderStatusEnum })
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;

    @ApiProperty({ type: [CreateOrderItemDto], description: 'Danh sách sản phẩm' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}