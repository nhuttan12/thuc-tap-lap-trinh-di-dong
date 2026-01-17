import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateProductAdminDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discount?: number;

    @IsOptional()
    @IsNumber()
    category_id?: number;  // Optional vì có thể không thay đổi category

    @IsOptional()
    @IsString()
    size?: string;  // CHUYỂN từ string[] thành string (để phù hợp với frontend)

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    status?: string;  // THÊM status cho update
}