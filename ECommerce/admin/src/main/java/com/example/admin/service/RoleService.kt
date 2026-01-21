package com.example.admin.service

import retrofit2.Response
import retrofit2.http.GET

interface RoleApiService {

    @GET("admin/roles")
    suspend fun getRoles(): Response<List<RoleDTO>>

    @GET("roles")  // Hoặc endpoint khác
    suspend fun getAllRoles(): Response<List<RoleDTO>>
}

data class RoleDTO(
        val id: Int,
        val name: String,
        val status: String? = null
)