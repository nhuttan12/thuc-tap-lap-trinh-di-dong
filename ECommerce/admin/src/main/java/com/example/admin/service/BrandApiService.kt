package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import com.example.admin.dto.BrandDTO
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

// BrandApiService.kt
interface BrandApiService {
    @GET("brands")
    suspend fun getBrands(
            @Query("limit") limit: Int = 20  // THÊM limit parameter
    ): Response<ApiSuccess<List<BrandDTO>>>
}


