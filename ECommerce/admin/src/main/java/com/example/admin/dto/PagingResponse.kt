package com.example.admin.dto

data class PagingResponse<T>(
        val data: List<T> = emptyList(),
        val meta: PagingMeta = PagingMeta()
)

data class PagingMeta(
        val page: Int = 1,
        val limit: Int = 20,
        val total: Int = 0,
        val totalPages: Int = 1
)

