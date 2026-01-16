package com.example.admin.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.admin.model.UserModel
import com.example.admin.repository.UserRepository
import com.example.admin.service.ApiService
import kotlinx.coroutines.launch

class UserViewModel : ViewModel() {

    private val repository = UserRepository(ApiService.userService)

    private val _users = MutableLiveData<List<UserModel>>()
    val users: LiveData<List<UserModel>> = _users

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun loadUsers(page: Int = 1, limit: Int = 20, keyword: String? = null) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val userList = repository.getUsers(page, limit, keyword)
                _users.value = userList
            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi tải danh sách người dùng"
                _users.value = emptyList()
            } finally {
                _loading.value = false
            }
        }
    }

    fun createUser(
            username: String,
            email: String,
            password: String,
            fullName: String,
            roleId: String
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("UserViewModel", "Creating user: $username, roleId: $roleId")

                val newUser = repository.createUser(username, email, password, fullName, roleId)
                Log.d("UserViewModel", "User created: ${newUser.username}, ID: ${newUser.id}")

                loadUsers()

            } catch (e: Exception) {
                Log.e("UserViewModel", "Error creating user", e)
                _error.value = "Lỗi tạo người dùng: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateUser(
            id: Int,
            roleId: Int? = null,
            status: String? = null,
            fullName: String? = null,
            email: String? = null
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("UserViewModel", "Updating user $id: fullName=$fullName, email=$email, roleId=$roleId, status=$status")

                val updatedUser = repository.updateUser(
                        id = id,
                        roleId = roleId,
                        status = status,
                        fullName = fullName,
                        email = email
                )
                Log.d("UserViewModel", "User updated: ${updatedUser.username}")

                loadUsers()

            } catch (e: Exception) {
                Log.e("UserViewModel", "Error updating user", e)
                _error.value = e.message ?: "Lỗi cập nhật người dùng"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateUserStatus(id: Int, status: String) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                repository.updateUserStatus(id, status)
                loadUsers()
            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi cập nhật trạng thái"
            } finally {
                _loading.value = false
            }
        }
    }

    fun getUserDetail(id: Int, onSuccess: (UserModel) -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val user = repository.getUserDetail(id)
                onSuccess(user)
            } catch (e: Exception) {
                val errorMsg = e.message ?: "Lỗi lấy thông tin người dùng"
                _error.value = errorMsg
                onError(errorMsg)
            } finally {
                _loading.value = false
            }
        }
    }

    fun searchUsers(keyword: String) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val userList = repository.getUsers(keyword = keyword)
                _users.value = userList

            } catch (e: Exception) {
                Log.e("UserViewModel", "Error searching users", e)
                _error.value = "Lỗi tìm kiếm: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    // Delete user - ĐƠN GIẢN HÓA
    fun deleteUser(id: Int) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // 1. Optimistic update: Xoá ngay trong UI
                val currentList = _users.value?.toMutableList() ?: mutableListOf()
                currentList.removeAll { it.id == id }
                _users.value = currentList

                // 2. Gọi API xoá
                repository.deleteUser(id)

            } catch (e: Exception) {
                Log.e("UserViewModel", "Error deleting user", e)

                // Nếu lỗi, reload toàn bộ list
                loadUsers()

                _error.value = "Lỗi xoá người dùng: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}