package com.example.e_commerce.Model

data class ErrorResponse(
    val statusCode: Int,
    val message: String,
    val timestamp: String? = null,
    val path: String? = null
)