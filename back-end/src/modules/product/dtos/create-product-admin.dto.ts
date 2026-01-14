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

    @IsNumber()
    category_id: number;

    @IsArray()
    @IsString({ each: true })
    size: string[];

    @IsString()
    color: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating?: number;
}