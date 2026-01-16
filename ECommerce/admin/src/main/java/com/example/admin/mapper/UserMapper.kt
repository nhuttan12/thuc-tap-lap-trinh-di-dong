package com.example.admin.mapper

import com.example.admin.dto.UserDTO
import com.example.admin.model.UserModel
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object UserMapper {
    private val gson = Gson()

    fun toUserModel(dto: UserDTO): UserModel {
        var roleName = ""
        var roleId: Int? = null

        // Xử lý role nếu là object
        if (dto.role != null) {
            when {
                dto.role is String -> {
                    roleName = dto.role as String
                }
                dto.role is Map<*, *> -> {
                    // Convert Map to Role object
                    val json = gson.toJson(dto.role)
                    val type = object : TypeToken<RoleInfo>() {}.type
                    val roleInfo = gson.fromJson<RoleInfo>(json, type)
                    roleName = roleInfo.name ?: ""
                    roleId = roleInfo.id
                }
            }
        }

        return UserModel(
                id = dto.id ?: 0,
                username = dto.username ?: "",
                email = dto.email ?: "",
                fullName = dto.fullName ?: "",
                role = roleName,
                status = dto.status ?: "ACTIVE",
                createdAt = dto.createdAt ?: "",
                updatedAt = dto.updatedAt ?: "",
                roleId = roleId
        )
    }

    private data class RoleInfo(
            val id: Int? = null,
            val name: String? = null,
            val status: String? = null
    )

    fun toUserList(dtos: List<UserDTO>): List<UserModel> {
        return dtos.map { toUserModel(it) }
    }
}