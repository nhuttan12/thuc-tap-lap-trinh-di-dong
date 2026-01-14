package com.example.admin.service

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // Đổi IP thành IP của máy chạy API
    private const val BASE_URL = "http://192.168.1.5:8080/"
    // Hoặc: "http://10.0.2.2:3000/api/" (Android Emulator)

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                        .addHeader("Content-Type", "application/json")
                        // Thêm token nếu có
                        // .addHeader("Authorization", "Bearer $token")
                        .build()
                chain.proceed(request)
            }
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()

    private val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }
}