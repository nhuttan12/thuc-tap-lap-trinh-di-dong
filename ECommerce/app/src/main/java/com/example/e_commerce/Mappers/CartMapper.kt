package com.example.e_commerce.Mappers

import com.example.e_commerce.DTOs.Response.CartDetailResponseDto
import com.example.e_commerce.Model.CartItemModel

object CartMapper {
    fun fromCartDetailResponseDto(cartDetailResponseDto: CartDetailResponseDto): CartItemModel {
        return CartItemModel(
            id = cartDetailResponseDto.id,
            title = cartDetailResponseDto.name,
            picUrl = cartDetailResponseDto.imageUrl,
            price = cartDetailResponseDto.price,
            numberInCart = cartDetailResponseDto.quantity
        )
    }

    fun fromCartDetailResponseDtoList(cartDetailResponseDtoList: List<CartDetailResponseDto>): List<CartItemModel> {
        return cartDetailResponseDtoList.map { it ->
            fromCartDetailResponseDto(it)
        }
    }
}