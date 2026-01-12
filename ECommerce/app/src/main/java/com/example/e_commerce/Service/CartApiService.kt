package com.example.e_commerce.Service

import com.example.e_commerce.DTOs.Request.AddProductToCartRequestDto
import com.example.e_commerce.DTOs.Request.RemoveProductFromCartRequestDto
import com.example.e_commerce.DTOs.Request.UpdateQuantityCartDetailRequestDto
import com.example.e_commerce.DTOs.Response.CartDetailResponseDto
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Repository.PagingResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query

interface CartApiService {
    @GET("carts")
    suspend fun getUserCart(
        @Header("Authorization") token: String,
        @Query("limit") limit: Int,
        @Query("page") page: Int
    ): Response<ApiSucess<PagingResponse<CartDetailResponseDto>>>

    @POST("carts/add-to-cart")
    suspend fun addProductToCart(
        @Header("Authorization") token: String,
        @Body() request: AddProductToCartRequestDto
    ): Response<ApiSucess<String>>

    suspend fun removeProductFromCart(
        @Header("Authorization") token: String,
        @Body() request: RemoveProductFromCartRequestDto
    ): Response<ApiSucess<Boolean>>

    suspend fun updateQuantityOfCartDetail(
        @Header("Authorization") token: String,
        @Body() request: UpdateQuantityCartDetailRequestDto
    ): Response<ApiSucess<CartDetailResponseDto>>
}