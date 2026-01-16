package com.example.admin.repository

import com.example.admin.mapper.UserMapper
import com.example.admin.model.UserModel
import com.example.admin.service.UserApiService
import retrofit2.Response

class UserRepository(
        private val api: UserApiService
) {

    suspend fun getUsers(page: Int = 1, limit: Int = 20, keyword: String? = null): List<UserModel> {
        val response = api.getUsers(page, limit, keyword)

        if (!response.isSuccessful) {
            val errorBody = response.errorBody()?.string()
            throw Exception("HTTP ${response.code()}: $errorBody")
        }

        val userListResponse = response.body()
        if (userListResponse == null) {
            throw Exception("Response body is null")
        }

        // Log để debug
        println("UserRepository: Loaded ${userListResponse.items.size} users")
        println("UserRepository: First user: ${userListResponse.items.firstOrNull()}")

        return UserMapper.toUserList(userListResponse.items)
    }

    suspend fun getUserDetail(id: Int): UserModel {
        val response = api.getUserDetail(id)

        return handleResponse(response) { userDto ->
            UserMapper.toUserModel(userDto)
        }
    }

    suspend fun createUser(
            username: String,
            email: String,
            password: String,
            fullName: String,
            roleId: Int
    ): UserModel {
        val request = UserApiService.CreateUserRequest(
                username = username,
                email = email,
                password = password,
                fullName = fullName,
                roleId = roleId
        )

        val response = api.createUser(request)

        return handleResponse(response) { userDto ->
            UserMapper.toUserModel(userDto)
        }
    }

    suspend fun updateUser(
            id: Int,
            fullName: String? = null,
            roleId: Int? = null,
            status: String? = null
    ): UserModel {
        val request = UserApiService.UpdateUserRequest(
                fullName = fullName,
                roleId = roleId,
                status = status
        )

        val response = api.updateUser(id, request)

        return handleResponse(response) { userDto ->
            UserMapper.toUserModel(userDto)
        }
    }

    suspend fun updateUserStatus(id: Int, status: String): UserModel {
        val request = mapOf("status" to status)
        val response = api.updateUserStatus(id, request)

        return handleResponse(response) { userDto ->
            UserMapper.toUserModel(userDto)
        }
    }

    // Helper function
    private fun <T, R> handleResponse(
            response: Response<T>,
            onSuccess: (T) -> R
    ): R {
        if (!response.isSuccessful) {
            val errorBody = response.errorBody()?.string()
            throw Exception("HTTP ${response.code()}: $errorBody")
        }

        val body = response.body()
        if (body == null) {
            throw Exception("Response body is null")
        }

        return onSuccess(body)
    }
}