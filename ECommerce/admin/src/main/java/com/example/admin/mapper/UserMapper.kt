package com.example.admin.mapper

import com.example.admin.dto.UserDTO
import com.example.admin.model.UserModel

object UserMapper {

    fun toUserModel(dto: UserDTO): UserModel {
        return UserModel(
                id = dto.id,
                username = dto.username,
                email = dto.email,
                fullName = dto.fullName,
                role = dto.role?.name ?: "Unknown",
                status = dto.status,
                createdAt = dto.createdAt ?: "",
                roleId = dto.role?.id
        )
    }

    fun toUserList(dtos: List<UserDTO>): List<UserModel> {
        return dtos.map { toUserModel(it) }
    }
}