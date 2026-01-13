/**
 * @description Product model for fetching api from backend
 * @author @nhuttan12
 * @since 2025-11-06
 * @modifies 2025-11-06
 * @modifies 2026-01-07
 * @version 1.0.2
 */

package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass
import java.io.Serializable

@JsonClass(generateAdapter = true)
data class ProductModel(
    var id: Int = 0,
    var title: String = "",
    var picUrl: String = "",
    var price: Double = 0.0,
    var rating: Double = 0.0,
    var isInWishlist: Boolean = false
) : Serializable
