import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { IsArray } from 'class-validator';

export class CreateProductAdminDto {
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    price: number;

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
    @IsString()
    size?: string;

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
    status?: string = 'ACTIVE';
}