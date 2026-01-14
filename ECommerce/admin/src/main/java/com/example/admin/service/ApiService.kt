package com.example.admin.service

import com.example.admin.AdminApplication
import com.example.admin.utils.TokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiService {
    // ĐỔI IP NÀY
    private const val BASE_URL: String = "http://10.0.2.2:8080/"
    // Hoặc: "http://192.168.1.5:3000/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

    private val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    val productService: ProductApiService by lazy {
        retrofit.create(ProductApiService::class.java)
    }

    val userService: UserApiService by lazy {
        retrofit.create(UserApiService::class.java)
    }

    val authService: AuthApiService =
            retrofit.create(AuthApiService::class.java)

    val interceptor = Interceptor { chain ->
        val token = TokenManager.get(AdminApplication.context)

        val request = chain.request().newBuilder().apply {
            if (!token.isNullOrEmpty()) {
                addHeader("Authorization", "Bearer $token")
            }
        }.build()

        chain.proceed(request)
    }

}