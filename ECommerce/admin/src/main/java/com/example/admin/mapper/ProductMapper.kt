package com.example.admin.mapper

import com.example.admin.model.Product
import com.example.admin.dto.ProductDTO

object ProductMapper {

    fun toProduct(dto: ProductDTO): Product {
        val details = dto.productDetailsEntity
        val sizeDisplay = details?.size ?: ""
        return Product(
                id = dto.id,
                name = dto.name,
                price = dto.price,
                discount = dto.discount,
                status = dto.status,

                description = details?.description.orEmpty(),

                imageUrl = dto.productImages
                        ?.firstOrNull()
                        ?.image
                        ?.url
                        ?: "https://via.placeholder.com/150",

                category = details?.categoryEntity?.name.orEmpty(),

                size = sizeDisplay,


                        color = details?.color.orEmpty()
        )
    }

    fun toProductList(dtos: List<ProductDTO>): List<Product> {
        return dtos.map { toProduct(it) }
    }
}
