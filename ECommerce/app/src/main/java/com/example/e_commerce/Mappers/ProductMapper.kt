/**
 * @description Product mapper object
 * @author @nhuttan12
 * @since 2025-24-12
 * @modifies 2026-01-07
 * @version 1.0.1
 */

package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.Response.ProductDTO
import com.example.e_commerce.DTOs.Response.ProductDetailDTO
import com.example.e_commerce.DTOs.Response.ProductInWishlistResponseDto
import com.example.e_commerce.Helper.StringConverter
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Model.ProductModel

object ProductMapper {
    private val stringConverter: StringConverter = StringConverter()

    fun fromProductDTO(productDTO: ProductDTO): ProductModel {
        return ProductModel(
            id = productDTO.productID,
            title = productDTO.name,
            price = productDTO.price.toDouble(),
            picUrl = productDTO.imageUrl,
            rating = productDTO.rating,
            isInWishlist = productDTO.isInWishlist
        )
    }

    fun fromProductDTOList(productDTOList: List<ProductDTO>): ArrayList<ProductModel> {
        return productDTOList.map { fromProductDTO(it) }.toCollection(ArrayList())
    }

    fun fromProductDetailDTO(productDetailDTO: ProductDetailDTO): ProductDetailModel {
        return ProductDetailModel(
            title = productDetailDTO.name,
            description = this.stringConverter.splitDescription(productDetailDTO.description),
            picUrl = ArrayList(productDetailDTO.imageList),
            size = ArrayList(productDetailDTO.size),
            color = ArrayList(productDetailDTO.color),
            price = applyDiscount(productDetailDTO.price.toDouble(), productDetailDTO.discount),
            oldPrice = productDetailDTO.price.toDouble(),
            rating = productDetailDTO.rating,
            numberInCart = 1
        )
    }

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

    fun fromProductInWishlistResponseDto(productInWishlistResponseDto: ProductInWishlistResponseDto): ProductModel {
        return ProductModel(
            id = productInWishlistResponseDto.productID,
            title = productInWishlistResponseDto.name,
            picUrl = productInWishlistResponseDto.imageUrl,
            price = productInWishlistResponseDto.price,
            rating = productInWishlistResponseDto.rating
        )
    }

    fun fromProductInWishlistResponseDtoList(productInWishlistResponseDtoList: List<ProductInWishlistResponseDto>): List<ProductModel> {
        return productInWishlistResponseDtoList.map { fromProductInWishlistResponseDto(it) }
    }
}