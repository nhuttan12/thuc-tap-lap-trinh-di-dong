package com.example.admin.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.admin.model.Product
import com.example.admin.repository.ProductRepository
import kotlinx.coroutines.launch

class ProductViewModel : ViewModel() {

    private val repository = ProductRepository()

    // THÊM: LiveData cho products
    private val _products = MutableLiveData<List<Product>>()
    val products: LiveData<List<Product>> = _products

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private fun loadProducts(page: Int = 1) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null

            val result = repository.getProducts(page)

            if (result.isSuccess) {
                _products.value = result.getOrNull() ?: emptyList()
            } else {
                _error.value = result.exceptionOrNull()?.message ?: "Lỗi không xác định"
            }

            _isLoading.value = false
        }
    }

    fun deleteProduct(id: Int, onSuccess: () -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            _isLoading.value = true

            val result = repository.deleteProduct(id)

            if (result.isSuccess) {
                onSuccess()
                loadProducts() // Reload
            } else {
                onError(result.exceptionOrNull()?.message ?: "Lỗi xóa sản phẩm")
            }

            _isLoading.value = false
        }
    }
}