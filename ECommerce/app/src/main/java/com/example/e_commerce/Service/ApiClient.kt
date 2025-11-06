package com.example.e_commerce.Service

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

object ApiClient {
    private val moshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()

    private val retrofit =
        Retrofit.Builder().baseUrl("default api").addConverterFactory(
            MoshiConverterFactory.create(moshi)
        ).build()

    val productService: ProductApiService by lazy {
        retrofit.create(ProductApiService::class.java)
    }
}