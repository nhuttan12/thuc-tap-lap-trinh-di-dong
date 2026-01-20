package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("auth/login")
    suspend fun login(
            @Body body: LoginRequest
    ): Response<LoginResponse>

    @POST("auth/logout")
    suspend fun logout(): Response<ApiSuccess<Unit>>

    // Nếu backend không hỗ trợ refresh token, có thể bỏ qua
    // @POST("auth/refresh-token")
    // suspend fun refreshToken(
    //     @Body body: RefreshTokenRequest
    // ): Response<ApiSuccess<LoginResponse>>
}

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

// Có thể không cần nếu backend không hỗ trợ
// data class RefreshTokenRequest(
//     val refreshToken: String
// )