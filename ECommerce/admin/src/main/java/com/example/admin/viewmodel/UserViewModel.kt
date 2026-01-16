package com.example.admin.viewmodel

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

    // Sửa hàm updateUser theo signature mới
    fun updateUser(
            id: Int,
            fullName: String? = null,
            roleId: Int? = null,
            status: String? = null
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // Gọi repository với đúng tham số
                val updatedUser = repository.updateUser(id, fullName, roleId, status)

                // Cập nhật danh sách
                loadUsers()

                // Có thể emit event thành công nếu cần
                // _updateSuccess.value = true
            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi cập nhật người dùng"
            } finally {
                _loading.value = false
            }
        }
    }

    // Hàm riêng cho update status
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

    // Hàm tạo user mới
    fun createUser(
            username: String,
            email: String,
            password: String,
            fullName: String,
            roleId: Int
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val newUser = repository.createUser(username, email, password, fullName, roleId)

                // Thêm user mới vào danh sách hoặc reload
                loadUsers()

                // Có thể emit event thành công
                // _createSuccess.value = newUser
            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi tạo người dùng"
            } finally {
                _loading.value = false
            }
        }
    }

    // Hàm lấy chi tiết user
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

    // Clear error
    fun clearError() {
        _error.value = null
    }
}