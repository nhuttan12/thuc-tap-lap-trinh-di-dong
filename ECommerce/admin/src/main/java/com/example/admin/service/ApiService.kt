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
    private const val BASE_URL: String = "http://10.0.2.2:8080/"

    // Interceptor xử lý 401
    private val authInterceptor = Interceptor { chain ->
        var request = chain.request()

        // Thêm token hiện tại
        val token = TokenManager.get(AdminApplication.context)

        if (!token.isNullOrEmpty()) {
            request = request.newBuilder()
                    .addHeader("Authorization", "Bearer $token")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Accept", "application/json")
                    .build()

            Log.d("AuthInterceptor", "Adding token to request: ${token.take(20)}...")
        } else {
            Log.d("AuthInterceptor", "No token found")
        }

        val response = chain.proceed(request)

        // Xử lý 401 - Token hết hạn
        if (response.code == 401) {
            Log.w("AuthInterceptor", "Received 401 - Token expired or invalid")

            // Đóng response hiện tại
            response.close()

            // Nếu là login request, không cần retry
            if (request.url.encodedPath.contains("auth/login")) {
                return@Interceptor response
            }

            // Nếu không phải login, xóa token và quay lại login
            TokenManager.clear(AdminApplication.context)

            // Có thể chuyển hướng đến login ở đây
            // Nhưng trong interceptor không có context của Activity
            // Nên chỉ clear token, Activity sẽ tự detect

            // Tạo request mới không có token (hoặc có thể throw exception)
            val newRequest = request.newBuilder()
                    .removeHeader("Authorization")
                    .build()

            return@Interceptor chain.proceed(newRequest)
        }

        response
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

    private val retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    // Lazy initialization của các service
    val userService: UserApiService by lazy { retrofit.create(UserApiService::class.java) }
    val authService: AuthApiService by lazy { retrofit.create(AuthApiService::class.java) }
    val roleService: RoleApiService by lazy { retrofit.create(RoleApiService::class.java) }
    val productService: ProductApiService by lazy { retrofit.create(ProductApiService::class.java) }

    // Hàm update token
    fun updateToken(token: String) {
        TokenManager.save(AdminApplication.context, token)
    }

    // Hàm clear token
    fun clearToken() {
        TokenManager.clear(AdminApplication.context)
    }
}