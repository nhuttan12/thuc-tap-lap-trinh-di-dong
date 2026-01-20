import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {Transform} from "class-transformer";

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
    // Hỗ trợ cả array và string
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(item => item.trim());
        return value;
    })
    size?: string[] | string;

    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(item => item.trim());
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
    status?: string = 'ACTIVE';
}