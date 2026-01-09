/**
 * @description Cart detail response dto from api
 * @author @nhuttan12
 * @since 2026-01-09
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Response

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class CartDetailResponseDto(
    val id: Int,
    val imageUrl: String,
    val name: String,
    val price: Double,
    val discount: Number,
    val quantity: Int,
)
