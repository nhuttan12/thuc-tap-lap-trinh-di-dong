
package com.example.admin.mapper

import com.example.admin.dto.ProductDetailDTO
import com.example.admin.model.Product

object ProductDetailMapper {

    fun toProduct(dto: ProductDetailDTO): Product {
        return Product(
                id = dto.id,
                name = dto.name,
                price = dto.price,
                discount = dto.discount,
                status = "ACTIVE", // Default
                description = dto.description,
                imageUrl = dto.imageList.firstOrNull() ?: "",
                category = "",
                size = dto.size.joinToString(","),
                color = dto.color
        )
    }
}