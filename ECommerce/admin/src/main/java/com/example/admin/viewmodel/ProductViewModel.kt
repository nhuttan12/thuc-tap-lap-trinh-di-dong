// ProductViewModel.kt
package com.example.admin.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.admin.fragment.ProductCache
import com.example.admin.mapper.ProductMapper
import com.example.admin.model.Product
import com.example.admin.repository.ProductRepository
import com.example.admin.service.ApiService
import com.example.admin.service.CreateProductRequest
import com.example.admin.service.UpdateProductRequest
import kotlinx.coroutines.launch

class ProductViewModel : ViewModel() {

    private val repository = ProductRepository()

    private val _products = MutableLiveData<List<Product>>()
    val products: LiveData<List<Product>> = _products

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    // THÊM HÀM SEARCH:
    fun searchProducts(keyword: String) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("ProductViewModel", "Searching products with keyword: '$keyword'")

                if (keyword.isEmpty()) {
                    // Nếu keyword rỗng, set danh sách rỗng
                    _products.value = emptyList()
                    Log.d("ProductViewModel", "Empty keyword, clearing search results")
                    return@launch
                }

                val result = repository.searchProducts(keyword)
                _products.value = result

                Log.d("ProductViewModel", "Search results: ${result.size} products")

            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error searching products", e)
                _error.value = "Lỗi tìm kiếm sản phẩm: ${e.message}"
                _products.value = emptyList()
            } finally {
                _loading.value = false
            }
        }
    }
    fun loadProducts(page: Int = 1) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // 1. Lấy danh sách cơ bản
                val productList = repository.getProducts(page)

                // 2. Preload details cho 5 sản phẩm đầu tiên (async)
                productList.take(5).forEach { product ->
                    launch {
                        try {
                            repository.getProductDetailForAdmin(product.id)
                            // ProductMapper sẽ tự động cache
                        } catch (e: Exception) {
                            // Ignore errors in preloading
                        }
                    }
                }

                _products.value = productList

                // Debug
                Log.d("ProductViewModel", "Loaded ${productList.size} products")
                productList.forEachIndexed { index, product ->
                    Log.d("ProductViewModel",
                            "$index. ${product.name}\n" +
                                    "   Size: '${product.size}' | Color: '${product.color}'\n" +
                                    "   Brand: ${product.brand} | Category: ${product.category}")
                }

            } catch (e: Exception) {
                Log.e("ProductViewModel", "Load error", e)
                _error.value = e.message ?: "Lỗi tải danh sách sản phẩm"
                _products.value = emptyList()
            } finally {
                _loading.value = false
            }
        }
    }

    // Thêm hàm để update cache khi có thay đổi
    fun updateProductInCache(product: Product) {
        ProductCache.update(product)

        // Cập nhật ngay trong list hiện tại
        val currentList = _products.value?.toMutableList() ?: mutableListOf()
        val index = currentList.indexOfFirst { it.id == product.id }
        if (index != -1) {
            currentList[index] = product
            _products.value = currentList
        } else {
            // Thêm vào đầu nếu là sản phẩm mới
            currentList.add(0, product)
            _products.value = currentList
        }
    }

    // SỬA: Dùng API admin
    fun getProductDetail(id: Int, onSuccess: (Product) -> Unit, onError: (String) -> Unit) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // GỌI API ADMIN THAY VÌ PUBLIC
                val response = ApiService.productService.getProductDetailForAdmin(id)

                if (response.isSuccessful) {
                    val apiResponse = response.body()
                    if (apiResponse?.success == true && apiResponse.data != null) {
                        val product = ProductMapper.toProduct(apiResponse.data!!)
                        onSuccess(product)
                    } else {
                        onError(apiResponse?.message ?: "Lỗi không xác định")
                    }
                } else {
                    onError("HTTP ${response.code()}: ${response.errorBody()?.string()}")
                }
            } catch (e: Exception) {
                val errorMsg = e.message ?: "Lỗi lấy thông tin sản phẩm"
                _error.value = errorMsg
                onError(errorMsg)
            } finally {
                _loading.value = false
            }
        }
    }

    fun createProduct(
            name: String,
            price: Double,
            discount: Double,
            status: String,
            size: String? = null,
            color: String? = null,
            description: String? = null
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("ProductViewModel", "Creating product: $name, price=$price")

                val request = CreateProductRequest(
                        name = name,
                        price = price,
                        discount = discount,
                        status = status,
                        size = size,
                        color = color,
                        description = description
                )

                val newProduct = repository.createProduct(request)
                Log.d("ProductViewModel", "Product created: ${newProduct.name}, ID: ${newProduct.id}")

                loadProducts()

            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error creating product", e)
                _error.value = "Lỗi tạo sản phẩm: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateProduct(
            id: Int,
            name: String? = null,
            price: Double? = null,
            discount: Double? = null,
            status: String? = null,
            size: String? = null,
            color: String? = null,
            description: String? = null
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("ProductViewModel", "Updating product $id: name=$name, price=$price")

                val request = UpdateProductRequest(
                        name = name,
                        price = price,
                        discount = discount,
                        status = status,
                        size = size,
                        color = color,
                        description = description
                )

                val updatedProduct = repository.updateProduct(id, request)
                Log.d("ProductViewModel", "Product updated: ${updatedProduct.name}")

                loadProducts()

            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error updating product", e)
                _error.value = e.message ?: "Lỗi cập nhật sản phẩm"
            } finally {
                _loading.value = false
            }
        }
    }

    fun deleteProduct(id: Int) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // 1. Optimistic update: Xoá ngay trong UI
                val currentList = _products.value?.toMutableList() ?: mutableListOf()
                currentList.removeAll { it.id == id }
                _products.value = currentList

                // 2. Gọi API xoá
                repository.deleteProduct(id)

            } catch (e: Exception) {
                Log.e("ProductViewModel", "Error deleting product", e)

                // Nếu lỗi, reload toàn bộ list
                loadProducts()

                _error.value = "Lỗi xoá sản phẩm: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }
}