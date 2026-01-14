package com.example.admin.repository

import com.example.admin.mapper.UserMapper
import com.example.admin.model.UserModel
import com.example.admin.service.UserApiService

class UserRepository(
        private val api: UserApiService
) {

    suspend fun getUsers(page: Int, limit: Int): List<UserModel> {
        val res = api.getUsers(page, limit)

        if (!res.isSuccessful) {
            throw Exception("HTTP ${res.code()}")
        }

        val body = res.body()?.data ?: return emptyList()
        return UserMapper.toUserList(body.data)
    }

    suspend fun updateUser(
            id: Int,
            roleId: Int?,
            status: String?
    ) {
        val res = api.updateUser(
                id,
                UserApiService.UpdateUserRequest(
                        roleId = roleId,
                        status = status
                )
        )

        if (!res.isSuccessful) {
            throw Exception("Update user failed")
        }
    }
}



