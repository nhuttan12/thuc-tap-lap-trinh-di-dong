/**
 * @description Brand service for fetching api from backend
 * @author nhuttan12
 * @version 1.0.0
 * @since 2025-12-13
 */

package com.example.e_commerce.Service

import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.ApiResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface BrandApiService {
    @GET("brands")
    suspend fun getBrandsWithLimitation(@Query("limit") limit: Int): Response<ApiResponse<List<BrandModel>>>
}