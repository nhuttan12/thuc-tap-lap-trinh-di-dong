/**
 * @description Product in wishlist response dto
 * @author @nhuttan12
 * @since 2026-01-11
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Response

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductInWishlistResponseDto(
    val productID: Int,
    val name: String,
    val imageUrl: String,
    val price: Double,
    val discount: Int,
    val rating: Double,
    val createdAt: String,
    val updatedAt: String,
)
