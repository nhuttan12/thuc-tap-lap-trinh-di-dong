// product-admin-response.dto.ts
import { ProductImageTypeEnum } from '../enums/product-image-type.enum';
import { ProductStatusEnum } from '../enums/product-status.enum';

export class ProductAdminResponseDto {
    id: number;
    name: string;
    price: number;
    discount: number;
    status: ProductStatusEnum; // Thay string bằng enum
    category?: { id: number; name: string };
    brand?: { id: number; name: string };
    size: string[];
    color: string[];
    description: string;
    rating: number;
    images: {
        id?: number;       // optional thay vì required
        url?: string;      // optional thay vì required
        type: ProductImageTypeEnum; // enum thay vì string
    }[];
    createdAt: Date;
    updatedAt: Date;
}