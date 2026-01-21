package com.example.admin.mapper

import com.example.admin.dto.ProductDTO
import com.example.admin.model.Product

object ProductDetailMapper {

    fun toProduct(dto: ProductDTO): Product {
        val details = dto.productDetailsEntity

        // DEBUG
        println("🔍 ProductMapper - Parsing: id=${dto.id}, name=${dto.name}")

        // FIX: Xử lý discount NaN
        val discount = when {
            dto.discount.isNaN() -> 0.0
            else -> dto.discount
        }

        return Product(
            id = dto.id,
            name = dto.name,
            price = dto.price,
            discount = discount, // Đã xử lý NaN
            status = dto.status,
            description = details?.description.orEmpty(),
            imageUrl = dto.imageUrl,
            category = details?.categoryEntity?.name.orEmpty(),
            size = details?.size ?: "",
            color = details?.color ?: ""
        )
    }
}