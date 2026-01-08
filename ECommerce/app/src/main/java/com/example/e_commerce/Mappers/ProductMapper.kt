/**
 * @description Product mapper object
 * @author @nhuttan12
 * @since 2025-24-12
 * @modifies 2026-01-07
 * @version 1.0.1
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.ProductDTO
import com.example.e_commerce.Model.ProductModel

object ProductMapper {
    fun fromDto(dto: ProductDTO): ProductModel {
        return ProductModel(
            id = dto.id,
            title = dto.name,
            price = dto.price.toDouble(),
            picUrl = dto.imageUrl,
            rating = dto.rating,
        )
    }

    fun fromDtoList(dtos: List<ProductDTO>): ArrayList<ProductModel> {
        return dtos.map { fromDto(it) }.toCollection(ArrayList())
    }

//    private fun calculateOldPrice(price: Int, discount: Int): Double {
//        return if (discount > 0) {
//            price + (price * discount / 100.0)
//        } else {
//            price.toDouble()
//        }
//    }
}