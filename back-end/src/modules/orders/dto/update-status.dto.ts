import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class UpdateStatusDto {
    @ApiProperty({
        description: 'Trạng thái mới của đơn hàng',
        enum: OrderStatusEnum,
        example: OrderStatusEnum.ACTIVE
    })
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;
}