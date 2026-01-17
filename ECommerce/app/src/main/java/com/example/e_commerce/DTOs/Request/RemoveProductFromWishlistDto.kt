/**
 * @description Remove product from wishlist request dto
 * @author @nhuttan12
 * @since 2026-01-11
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Request

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class RemoveProductFromWishlistDto(
    val productID: Int
)
