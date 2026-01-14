package com.example.admin.dto

data class UserDTO(
        val id: Int,
        val username: String,
        val email: String,
        val role: String,
        val status: String,
        val createdAt: String
)
