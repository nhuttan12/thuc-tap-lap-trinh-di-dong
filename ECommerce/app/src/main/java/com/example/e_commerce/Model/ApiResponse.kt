/**
 * @description Response model for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-13
 * @version 1.0.0
 */

package com.example.e_commerce.Model

data class ApiResponse<T>(
    val statusCode: String,
    val message: String,
    val data: T,
)
