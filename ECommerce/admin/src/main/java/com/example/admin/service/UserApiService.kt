package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import com.example.admin.dto.PagingResponse
import com.example.admin.dto.UserDTO
import retrofit2.Response
import retrofit2.http.*

interface UserApiService {

    @GET("admin/users")
    suspend fun getUsers(
            @Query("page") page: Int = 1,
            @Query("limit") limit: Int = 20,
            @Query("keyword") keyword: String? = null
    ): Response<ApiSuccess<PagingResponse<UserDTO>>>

    @GET("admin/users/{id}")
    suspend fun getUserDetail(
            @Path("id") id: Int
    ): Response<ApiSuccess<UserDTO>>

    @PUT("admin/users")
    suspend fun createUser(
            @Body body: CreateUserRequest
    ): Response<ApiSuccess<UserDTO>>

    @PUT("admin/users/{id}")
    suspend fun updateUser(
            @Path("id") id: Int,
            @Body body: UpdateUserRequest
    ): Response<ApiSuccess<UserDTO>>

    @PATCH("admin/users/{id}/status")
    suspend fun updateUserStatus(
            @Path("id") id: Int,
            @Body body: Map<String, String>
    ): Response<ApiSuccess<UserDTO>>


    data class CreateUserRequest(
            val username: String,
            val email: String,
            val password: String,
            val fullName: String,
            val roleId: Int
    )

    data class UpdateUserRequest(
            val fullName: String? = null,
            val roleId: Int? = null,
            val status: String? = null
    )

}
