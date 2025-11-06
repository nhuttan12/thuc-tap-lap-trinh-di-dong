package com.example.e_commerce.Service

import com.example.e_commerce.Model.ProductModel
import retrofit2.http.GET

interface ProductApiService {
    @GET("products")
    suspend fun getProducts(): MutableList<ProductModel>
}