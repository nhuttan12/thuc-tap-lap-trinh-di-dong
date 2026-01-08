/**
 * @description Product mapper object
 * @author @nhuttan12
 * @since 2025-24-12
 * @modifies 2026-01-07
 * @version 1.0.1
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.ProductDetailDTO
import com.example.e_commerce.Helper.StringConverter
import com.example.e_commerce.Model.ProductDetailModel

object ProductDetailMapper {
    private val stringConverter: StringConverter = StringConverter()
    fun fromDto(dto: ProductDetailDTO): ProductDetailModel {
        return ProductDetailModel(
            title = dto.name,
            description = this.stringConverter.splitDescription(dto.description),
            picUrl = ArrayList(dto.imageList),
            size = ArrayList(dto.size),
            color = ArrayList(dto.color),
            price = applyDiscount(dto.price.toDouble(), dto.discount),
            oldPrice = dto.price.toDouble(),
            rating = dto.rating,
            numberInCart = 1
        )
    }
//
//    fun fromDtoList(dtos: List<ProductDetailDTO>): ArrayList<ProductDetailModel> {
//        return dtos.map { fromDto(it) }.toCollection(ArrayList())
//    }

    fun applyDiscount(price: Double, discount: Int): Double {
        return if (discount in 1..100) {
            price * (100 - discount) / 100
        } else {
            price
        }
    }
}