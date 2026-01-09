/**
 * @description Response model for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-13
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ApiSucess<T>(
    val statusCode: String,
    val message: String,
    val data: T,
)
