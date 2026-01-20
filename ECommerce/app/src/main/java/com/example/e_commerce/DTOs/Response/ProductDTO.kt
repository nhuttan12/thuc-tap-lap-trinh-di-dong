/**
 * @description Product class for getting data from api
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @modifies 2026-01-07
 * @version 1.0.2
 */

package com.example.e_commerce.DTOs.Response

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductDTO(
    val productID: Int,
    val name: String,
    val price: Int,
    val rating: Double,
    val isInWishlist: Boolean,
    val imageUrl: String,
    val status: String,
)