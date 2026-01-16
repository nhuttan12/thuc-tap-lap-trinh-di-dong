package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {


        @POST("auth/login")
        suspend fun login(
                @Body body: LoginRequest
        ): Response<LoginResponse>  // Response trực tiếp, không qua ApiSuccess wrapper


        // Thêm logout nếu cần
    @POST("auth/logout")
    suspend fun logout(): Response<ApiSuccess<Unit>>

    // Thêm refresh token nếu cần
    @POST("auth/refresh-token")
    suspend fun refreshToken(
            @Body body: RefreshTokenRequest
    ): Response<ApiSuccess<LoginResponse>>
}

// Định nghĩa data class bên ngoài interface


data class RefreshTokenRequest(
        val refreshToken: String
)



data class LoginRequest(
        val username: String,
        val password: String
)

data class LoginResponse(
        val id: Int,
        val email: String,
        val role: String,
        val accessToken: String
)