import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto, CreateOrderItemDto } from './create-order.dto';
import { IsEnum, IsOptional, IsInt, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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

    @ApiProperty({
        description: 'Trạng thái đơn hàng',
        enum: OrderStatusEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;

    @ApiProperty({ type: [CreateOrderItemDto], description: 'Danh sách sản phẩm', required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items?: CreateOrderItemDto[];
}