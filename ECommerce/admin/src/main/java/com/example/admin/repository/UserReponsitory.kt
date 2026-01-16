package com.example.admin.repository

import android.util.Log
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
            Log.e("UserRepository", "Get users failed: HTTP ${response.code()}: $errorBody")
            throw Exception("HTTP ${response.code()}: $errorBody")
        }

        val userListResponse = response.body()
        if (userListResponse == null) {
            throw Exception("Response body is null")
        }

        return UserMapper.toUserList(userListResponse.items)
    }

    suspend fun getUserDetail(id: Int): UserModel {
        Log.d("UserRepository", "Getting user detail for ID: $id")

        val response = api.getUserDetail(id)

        Log.d("UserRepository", "User detail response code: ${response.code()}")

        return handleResponse(response) { userDto ->
            UserMapper.toUserModel(userDto)
        }
    }

    suspend fun createUser(
            username: String,
            email: String,
            password: String,
            fullName: String,
            roleId: String  // ← ĐỔI từ roleName: String thành roleId: Int
    ): UserModel {
        val request = UserApiService.CreateUserRequest(
                username = username,
                email = email,
                password = password,
                fullName = fullName,
                roleName = roleId // ← Gửi roleId (Int)
        )

        Log.d("UserRepository", "=== CREATE USER REQUEST ===")
        Log.d("UserRepository", "Username: $username, Email: $email")
        Log.d("UserRepository", "Password length: ${password.length}")
        Log.d("UserRepository", "FullName: $fullName, RoleId: $roleId")
        Log.d("UserRepository", "Request body: $request")

        val response = api.createUser(request)

        Log.d("UserRepository", "Create user response code: ${response.code()}")
        Log.d("UserRepository", "Create user response body: ${response.body()}")

        val errorBody = response.errorBody()?.string()
        if (errorBody != null) {
            Log.e("UserRepository", "Create user response error: $errorBody")
        }

        return handleResponse(response) { userDto ->
            Log.d("UserRepository", "=== CREATE USER SUCCESS ===")
            Log.d("UserRepository", "Created user: id=${userDto.id}, username=${userDto.username}")
            UserMapper.toUserModel(userDto)
        }
    }

    suspend fun updateUser(
            id: Int,
            roleId: Int? = null,
            status: String? = null,
            fullName: String? = null,    // ĐỔI TÊN
            email: String? = null
    ): UserModel {
        val request = UserApiService.UpdateUserRequest(
                fullName = fullName,      // GỬI fullName
                email = email,
                roleId = roleId,
                status = status
        )

        Log.d("UserRepository", "=== UPDATE USER REQUEST ===")
        Log.d("UserRepository", "User ID: $id")
        Log.d("UserRepository", "Username: $fullName, Email: $email")  // LOG ĐẦY ĐỦ
        Log.d("UserRepository", "RoleId: $roleId, Status: $status")
        Log.d("UserRepository", "Request body: $request")

        val response = api.updateUser(id, request)

        Log.d("UserRepository", "Update user response code: ${response.code()}")
        Log.d("UserRepository", "Update user response body: ${response.body()}")

        val errorBody = response.errorBody()?.string()
        if (errorBody != null) {
            Log.e("UserRepository", "Update user response error: $errorBody")
        }

        return handleResponse(response) { userDto ->
            Log.d("UserRepository", "=== UPDATE USER SUCCESS ===")
            Log.d("UserRepository", "Updated user: id=${userDto.id}")
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
            Log.e("UserRepository", "HTTP ${response.code()}: $errorBody")
            throw Exception("HTTP ${response.code()}: $errorBody")
        }

        val body = response.body()
        if (body == null) {
            Log.e("UserRepository", "Response body is null")
            throw Exception("Response body is null")
        }

        return onSuccess(body)
    }
}