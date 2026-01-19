package com.example.admin.mapper

import com.example.admin.dto.ProductDTO
import com.example.admin.fragment.ProductCache
import com.example.admin.model.Product

object ProductMapper {

    // Xử lý null details
        fun toProduct(dto: ProductDTO): Product {
            val details = dto.productDetailsEntity

            println("🔄 Mapping ProductDTO id=${dto.id}")

            // Nếu không có details, check cache
            val cachedProduct = if (details == null) {
                println("⚠️ No details for product ${dto.id}, checking cache")
                ProductCache.get(dto.id)
            } else null

            return Product(
                    id = dto.id,
                    name = dto.name,
                    price = dto.price,
                    discount = if (dto.discount.isNaN()) 0.0 else dto.discount,
                    status = dto.status,

                    // Lấy từ details hoặc cache hoặc mặc định
                    size = details?.size ?: cachedProduct?.size ?: "",
                    color = details?.color ?: cachedProduct?.color ?: "",
                    description = details?.description ?: cachedProduct?.description ?: "",
                    rating = details?.rating ?: cachedProduct?.rating ?: 0f,

                    // QUAN TRỌNG: Lấy từ cache trước, nếu không có thì dùng mặc định
                    categoryId = details?.categoryEntity?.id ?: cachedProduct?.categoryId ?: 1,
                    category = details?.categoryEntity?.name ?: cachedProduct?.category ?: "Thể thao",
                    brandId = details?.brandEntity?.id ?: cachedProduct?.brandId ?: 2,
                    brand = details?.brandEntity?.name ?: cachedProduct?.brand ?: "Adidas",

                    imageUrl = dto.productImages
                            ?.firstOrNull { it.image != null }
                            ?.image?.url ?: ""
            ).also {
                println("✅ Mapped: ${it.name}, brand=${it.brand}(${it.brandId}), category=${it.category}(${it.categoryId})")
            }
        }

    fun toProductList(dtos: List<ProductDTO>): List<Product> {
        println("🔄 Converting ${dtos.size} DTOs to Products")
        return dtos.map { toProduct(it) }
    }


//    private fun parseSizeForDisplay(sizeString: String): String {
//        if (sizeString.isBlank()) return "37"
//
//        return when {
//            sizeString.contains(";") -> {
//                // Database format: "39; 40; 41" -> "39,40,41"
//                sizeString.split(";")
//                        .map { it.trim() }
//                        .filter { it.isNotBlank() }
//                        .joinToString(",")
//            }
//            sizeString.contains(",") -> {
//                // Đã là FE format
//                sizeString
//            }
//            else -> {
//                // Chỉ một giá trị
//                sizeString
//            }
//        }
//    }
//
//    private fun parseColorForDisplay(colorString: String): String {
//        if (colorString.isBlank()) return "Đen"
//
//        return when {
//            colorString.contains(";") -> {
//                // Database format: "Đỏ; Xanh; Đen" -> "Đỏ,Xanh,Đen"
//                colorString.split(";")
//                        .map { it.trim() }
//                        .filter { it.isNotBlank() }
//                        .joinToString(",")
//            }
//            colorString.contains(",") -> {
//                // Đã là FE format
//                colorString
//            }
//            else -> {
//                // Chỉ một giá trị
//                colorString
//            }
//        }
//    }
}