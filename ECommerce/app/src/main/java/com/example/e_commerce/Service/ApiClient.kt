/**
 * @description Api client for configuring retrofit
 * @author @nhuttan12
 * @since 2025-12-14
 * @version 1.0.0
 */

package com.example.e_commerce.Service

import com.example.e_commerce.Provider.MoshiProvider
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private val moshi = MoshiProvider.moshi

    private final const val IPv4: String = "10.0.2.2"
    private final const val BASE_URL: String = "http://$IPv4:8080/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .build()

    val productService: ProductApiService by lazy {
        retrofit.create(ProductApiService::class.java)
    }

    val brandService: BrandApiService by lazy {
        retrofit.create(BrandApiService::class.java)
    }

    val cartService: CartApiService by lazy {
        retrofit.create(CartApiService::class.java)
    }
}