import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import {Transform} from "class-transformer";

// ĐẢM BẢO có brand_id trong UpdateProductAdminDto
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
    category_id?: number;

    @IsOptional()
    @IsNumber()
    brand_id?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value;
        return value;
    })
    size?: string[] | string;  // <-- ĐỒNG BỘ

    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value;
        return value;
    })
    color?: string[] | string;

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
    status?: string;
}