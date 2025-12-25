/**
 * @description Product mapper object
 * @author @nhuttan12
 * @since 2025-24-12
 * @version 1.0.0
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.ProductDTO
import com.example.e_commerce.Model.ProductModel

object ProductMapper {
    fun fromDto(dto: ProductDTO): ProductModel {
        return ProductModel(
            title = dto.name,
            description = dto.description,
            picUrl = ArrayList(dto.imageUrl),
            size = ArrayList(dto.size),
            color = ArrayList(dto.color),
            price = dto.price.toDouble(),
            oldPrice = calculateOldPrice(dto.price, dto.discount),
            rating = dto.rating,
            numberInCart = 1
        )
    }

    fun fromDtoList(dtos: List<ProductDTO>): ArrayList<ProductModel> {
        return dtos.map { fromDto(it) }.toCollection(ArrayList())
    }

    private fun calculateOldPrice(price: Int, discount: Int): Double {
        return if (discount > 0) {
            price + (price * discount / 100.0)
        } else {
            price.toDouble()
        }
    }
}