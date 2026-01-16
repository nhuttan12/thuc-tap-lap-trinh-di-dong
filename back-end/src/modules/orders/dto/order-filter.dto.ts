import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatusEnum } from '../enums/order-status.enum';

export class OrderFilterDto {
    @ApiProperty({ description: 'Trạng thái đơn hàng', required: false, enum: OrderStatusEnum })
    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;

    @ApiProperty({ description: 'ID người dùng', required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    userId?: number;

    @ApiProperty({ description: 'Từ ngày (YYYY-MM-DD)', required: false })
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiProperty({ description: 'Đến ngày (YYYY-MM-DD)', required: false })
    @IsOptional()
    @IsDateString()
    toDate?: string;

    @ApiProperty({ description: 'Số trang', required: false, default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @ApiProperty({ description: 'Số lượng mỗi trang', required: false, default: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit: number = 10;
}