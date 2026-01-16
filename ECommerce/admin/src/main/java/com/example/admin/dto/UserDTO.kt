package com.example.admin.dto

data class UserDTO(
        val id: Int? = null,
        val username: String? = null,
        val email: String? = null,
        val fullName: String? = null,
        val status: String? = null,
        val createdAt: String? = null,
        val updatedAt: String? = null,
        // Role có thể là string hoặc object
        val role: Any? = null
)

data class RoleDTO(
        val id: Int,
        val name: String,
        val status: String? = null,
        val createdAt: String? = null,
        val updatedAt: String? = null
)