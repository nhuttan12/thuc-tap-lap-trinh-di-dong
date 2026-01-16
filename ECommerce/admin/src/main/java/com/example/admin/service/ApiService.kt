package com.example.admin.service

import android.util.Log
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

    // Tạo auth interceptor
    private val authInterceptor = Interceptor { chain ->
        val token = TokenManager.get(AdminApplication.context)
        Log.d("AuthInterceptor", "Token: $token") // Thêm log để debug

        val requestBuilder = chain.request().newBuilder()

        // Thêm Authorization header nếu có token
        if (!token.isNullOrEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }

        // Thêm các header khác
        requestBuilder.addHeader("Content-Type", "application/json")
        requestBuilder.addHeader("Accept", "application/json")

        chain.proceed(requestBuilder.build())
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    // THÊM authInterceptor vào client
    private val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(authInterceptor) // THÊM DÒNG NÀY
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

    private val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient) // Client đã có interceptor
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    val productService: ProductApiService by lazy {
        retrofit.create(ProductApiService::class.java)
    }

    val userService: UserApiService by lazy {
        retrofit.create(UserApiService::class.java)
    }

    val authService: AuthApiService by lazy {
        retrofit.create(AuthApiService::class.java)
    }

    // Hàm để update token khi login
    fun updateToken(token: String) {
        TokenManager.save(AdminApplication.context, token)
    }

    // Hàm để clear token khi logout
    fun clearToken() {
        TokenManager.clear(AdminApplication.context)
    }
}