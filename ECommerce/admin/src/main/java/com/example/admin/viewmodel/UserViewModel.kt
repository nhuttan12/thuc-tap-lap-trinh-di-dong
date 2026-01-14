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




    fun loadUsers(page: Int = 1, limit: Int = 20) {
        viewModelScope.launch {
            _users.value = repository.getUsers(page, limit)
        }
    }

    fun updateUser(id: Int, roleId: Int?, status: String?) {
        viewModelScope.launch {
            repository.updateUser(id, roleId, status)
            loadUsers()
        }
    }
}

