package com.example.admin.mapper

import com.example.admin.dto.UserDTO
import com.example.admin.model.UserModel

object UserMapper {

    fun toUser(dto: UserDTO): UserModel {
        return UserModel(
                id = dto.id,
                username = dto.username,
                email = dto.email,
                role = dto.role,
                status = dto.status
        )
    }

    fun toUserList(dtos: List<UserDTO>): List<UserModel> {
        return dtos.map { toUser(it) }
    }
}
