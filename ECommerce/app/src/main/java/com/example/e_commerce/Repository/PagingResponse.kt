/**
 * @description Paging response for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class PagingResponse<T>(
    val meta: PagingMeta,
    val data: List<T>
)