package com.example.admin.model

data class UserModel(
        val id: Int,
        val username: String,
        val email: String,
        val role: String,
        val status: String,
        val fullName: String = "",
        val createdAt: String = "",
        val updatedAt: String = "",
        val roleId: Int? = null
)