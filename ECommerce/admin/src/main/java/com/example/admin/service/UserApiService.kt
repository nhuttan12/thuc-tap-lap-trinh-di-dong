package com.example.admin.service

import com.example.admin.dto.UserDTO
import retrofit2.Response
import retrofit2.http.*

interface UserApiService {

    @GET("admin/users")
    suspend fun getUsers(
            @Query("page") page: Int = 1,
            @Query("limit") limit: Int = 20,
            @Query("keyword") keyword: String? = null
    ): Response<UserListResponse>

    @GET("admin/users/{id}")
    suspend fun getUserDetail(
            @Path("id") id: Int
    ): Response<UserDTO>

    @POST("admin/users")
    suspend fun createUser(
            @Body body: CreateUserRequest
    ): Response<UserDTO>

    @PUT("admin/users/{id}")
    suspend fun updateUser(
            @Path("id") id: Int,
            @Body body: UpdateUserRequest
    ): Response<UserDTO>

    @PUT("admin/users/{id}/status")
    suspend fun updateUserStatus(
            @Path("id") id: Int,
            @Body body: Map<String, String>
    ): Response<UserDTO>

    // Response DTOs
    data class UserListResponse(
            val items: List<UserDTO>,
            val total: Int,
            val page: String,
            val limit: String
    )

    data class CreateUserRequest(
            @field:Json(name = "username") val username: String,
            @field:Json(name = "email") val email: String,
            @field:Json(name = "password") val password: String,
            @field:Json(name = "fullName") val fullName: String,
            @field:Json(name = "roleName") val roleName: String
    )

    // UserApiService.kt
    data class UpdateUserRequest(
            @field:Json(name = "fullName") val fullName: String? = null,  // ĐỔI TÊN
            @field:Json(name = "email") val email: String? = null,
            @field:Json(name = "roleId") val roleId: Int? = null,
            @field:Json(name = "status") val status: String? = null
    )

    @DELETE("admin/users/{id}")
    suspend fun deleteUser(@Path("id") id: Int): Response<DeleteUserResponse>

    data class DeleteUserResponse(
            @field:Json(name = "data") val data: DeleteData? = null,
            @field:Json(name = "message") val message: String? = null,
            @field:Json(name = "statusCode") val statusCode: String? = null
    )

    data class DeleteData(
            @field:Json(name = "id") val id: Int
    )
}

annotation class Json(val name: String)
