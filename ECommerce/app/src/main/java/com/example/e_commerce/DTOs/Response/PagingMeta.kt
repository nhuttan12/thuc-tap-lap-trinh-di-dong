/**
 * @description Paging meta for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Response

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class PagingMeta(
    val page: Int,
    val limit: Int,
    val totalItems: Int,
    val totalPages: Int,
    val hasNextPage: Boolean,
    val hasPreviousPage: Boolean
)
