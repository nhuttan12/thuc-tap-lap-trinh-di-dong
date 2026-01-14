package com.example.admin.dto

data class ApiSuccess<T>(
        val success: Boolean = true,
        val data: T? = null,
        val message: String? = null,
        val statusCode: String? = null
)