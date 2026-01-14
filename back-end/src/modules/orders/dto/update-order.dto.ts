import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsInt, IsPositive } from 'class-validator';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiProperty({ description: 'ID người dùng', required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    userId?: number;

    @ApiProperty({ description: 'Tổng tiền', required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    price?: number;

    @ApiProperty({ description: 'Trạng thái đơn hàng', enum: OrderStatusEnum, required: false })
    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;
}