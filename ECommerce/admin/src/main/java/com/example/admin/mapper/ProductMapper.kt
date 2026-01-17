package com.example.admin.mapper

import com.example.admin.dto.ProductDTO
import com.example.admin.model.Product

object ProductMapper {

    fun toProduct(dto: ProductDTO): Product {
        val details = dto.productDetailsEntity

        // DEBUG
        println("🔍 ProductMapper - Parsing: id=${dto.id}, name=${dto.name}")

        return Product(
                id = dto.id,
                name = dto.name,
                price = dto.price,
                discount = dto.discount,
                status = dto.status,
                description = details?.description.orEmpty(),

                // Sửa: Kiểm tra cả productImages và imageUrl từ API
                imageUrl = when {
                    !dto.productImages.isNullOrEmpty() ->
                        dto.productImages.firstOrNull()?.image?.url ?: ""
                    else -> ""
                },

                category = details?.categoryEntity?.name.orEmpty(),
                size = details?.size ?: "",
                color = details?.color ?: ""
        )
    }

    fun toProductList(dtos: List<ProductDTO>): List<Product> {
        println("🔍 ProductMapper - Converting ${dtos.size} DTOs")
        dtos.forEachIndexed { index, dto ->
            println("  [$index] id=${dto.id}, name=${dto.name}")
        }
        return dtos.map { toProduct(it) }
    }
}