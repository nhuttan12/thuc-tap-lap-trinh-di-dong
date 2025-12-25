/**
 * @description Product service interface for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-14
 * @version 1.0.0
 */

package com.example.e_commerce.Service

import com.example.e_commerce.DTOs.ProductDTO
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.ApiResponse
import retrofit2.Response
import retrofit2.http.GET

interface ProductApiService {
    @GET("products")
    suspend fun getProducts(): Response<ApiResponse<List<ProductDTO>>>
}