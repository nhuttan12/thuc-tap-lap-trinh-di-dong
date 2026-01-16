package com.example.admin.dto

import com.google.gson.annotations.SerializedName

data class UserDTO(
        @SerializedName("id")
        val id: Int,

        @SerializedName("username")
        val username: String,

        @SerializedName("email")
        val email: String,

        @SerializedName("fullName")
        val fullName: String,

        @SerializedName("status")
        val status: String,

        @SerializedName("password")
        val password: String? = null,

        @SerializedName("createdAt")
        val createdAt: String? = null,

        @SerializedName("updatedAt")
        val updatedAt: String? = null,

        @SerializedName("role")
        val role: RoleDTO? = null
)

data class RoleDTO(
        @SerializedName("id")
        val id: Int,

        @SerializedName("name")
        val name: String,

        @SerializedName("status")
        val status: String? = null,

        @SerializedName("createdAt")
        val createdAt: String? = null,

        @SerializedName("updatedAt")
        val updatedAt: String? = null
)