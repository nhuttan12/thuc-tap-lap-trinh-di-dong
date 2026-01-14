package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {

    @POST("auth/login")
    suspend fun login(
            @Body body: LoginRequest
    ): Response<ApiSuccess<LoginResponse>>
}

data class LoginRequest(
        val username: String,
        val password: String
)

data class LoginResponse(
        val accessToken: String
)
