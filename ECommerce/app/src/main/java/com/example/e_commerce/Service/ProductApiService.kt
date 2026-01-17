/**
 * @description Product service interface for fetching api from backend
 * @author @nhuttan12
 * @since 2025-12-14
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Service

import com.example.e_commerce.DTOs.Response.ProductDTO
import com.example.e_commerce.DTOs.Response.ProductDetailDTO
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.DTOs.Response.PagingResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Query

interface ProductApiService {
    /**
     * Get products paging
     */
    @GET("products")
    suspend fun getProducts(
        @Header("Authorization") token: String?,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): Response<ApiSucess<PagingResponse<ProductDTO>>>

    /**
     * Get product detail by product ID
     */
    @GET("products/detail")
    suspend fun getProductDetailByProductID(
        @Query("productID") productID: Int
    ): Response<ApiSucess<ProductDetailDTO>>

    /**
     * Get products paging by name
     */
    @GET("products/productName")
    suspend fun getProductsByName(
        @Header("Authorization") token: String?,
        @Query("productName") productName: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): Response<ApiSucess<PagingResponse<ProductDTO>>>
}