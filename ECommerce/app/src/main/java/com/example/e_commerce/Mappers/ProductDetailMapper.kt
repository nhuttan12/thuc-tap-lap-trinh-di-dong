/**
 * @description Product mapper object
 * @author @nhuttan12
 * @since 2025-24-12
 * @modifies 2026-01-07
 * @version 1.0.1
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.ProductDetailDTO
import com.example.e_commerce.Model.ProductDetailModel

object ProductDetailMapper {
    fun fromDto(dto: ProductDetailDTO): ProductDetailModel {
        return ProductDetailModel(
            title = dto.name,
            description = dto.description,
            picUrl = ArrayList(dto.imageList),
            size = ArrayList(dto.size),
            color = ArrayList(dto.color),
            price = dto.price.toDouble(),
            oldPrice = calculateOldPrice(dto.price, dto.discount),
            rating = dto.rating,
            numberInCart = 1
        )
    }
//
//    fun fromDtoList(dtos: List<ProductDetailDTO>): ArrayList<ProductDetailModel> {
//        return dtos.map { fromDto(it) }.toCollection(ArrayList())
//    }

    private fun calculateOldPrice(price: Int, discount: Int): Double {
        return if (discount > 0) {
            price + (price * discount / 100.0)
        } else {
            price.toDouble()
        }
    }
}