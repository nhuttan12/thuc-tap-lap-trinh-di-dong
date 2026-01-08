/**
 * @description Product detail class for getting data from api
 * @author @nhuttan12
 * @since 2026-01-07
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProductDetailDTO(
    val id: Int,
    val name: String,
    val price: Int,
    val imageList: List<String>,
    val discount: Int,
    val color: List<String>,
    val rating: Double,
    val size: List<String>,
    val description: String
)