/**
 * @description Add product to cart request
 * @author @nhuttan12
 * @since 2026-01-09
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Request

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class AddProductToCartRequestDto(
    val productID: Int,
    val quantity: Int,
)
