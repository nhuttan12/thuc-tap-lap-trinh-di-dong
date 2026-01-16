/**
 * @description Wishlist api service for call api
 * @author @nhuttan12
 * @since 2026-01-11
 * @version 1.0.0
 */

package com.example.e_commerce.Service

import com.example.e_commerce.DTOs.Request.AddProductToWishlistRequestDto
import com.example.e_commerce.DTOs.Request.RemoveProductFromWishlistDto
import com.example.e_commerce.DTOs.Response.ProductInWishlistResponseDto
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.DTOs.Response.PagingResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Query

interface WishlistApiService {
    @GET("wishlist")
    suspend fun getAllProductInWishlist(
        @Header("Authorization") token: String,
        @Query("page") page: Int,
        @Query("limit") limit: Int
    ): Response<ApiSucess<PagingResponse<ProductInWishlistResponseDto>>>

    @POST("wishlist/add")
    suspend fun addProductToWishlist(
        @Header("Authorization") token: String,
        @Body() request: AddProductToWishlistRequestDto
    ): Response<ApiSucess<Boolean>>

    @PUT("wishlist/remove")
    suspend fun removeWishlistItem(
        @Header("Authorization") token: String,
        @Body() request: RemoveProductFromWishlistDto
    ): Response<ApiSucess<Boolean>>
}