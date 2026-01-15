/**
 * @description Main view model for connecting to Repository and display data to view
 * @author @nhuttan12
 * @since 2025-08-27
 * @modifies 2025-11-06
 * @modifies 2026 - 01-05
 * @version 1.0.2
 */

package com.example.e_commerce.ViewModel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Repository.ProductRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class ProductViewModel(
    private val tinyDB: TinyDB
) : ViewModel() {
    private val repository = ProductRepository(tinyDB)
    private val TAG = "ProductViewModel"
    var currentPage: Int = 1
        private set

    private val _popular = MutableLiveData<List<ProductModel>>()
    val popular: LiveData<List<ProductModel>> get() = _popular

    private val _productDetail = MutableLiveData<ProductDetailModel>()
    val productDetail: LiveData<ProductDetailModel> get() = _productDetail

    private var _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private var _popularLoading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val popularLoading: MutableLiveData<Boolean> get() = _popularLoading

    private var _productDetailLoading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val productDetailLoading: MutableLiveData<Boolean> get() = _productDetailLoading

    fun loadPopular(limit: Int, page: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _popularLoading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadPopular(limit = limit, page = page)) {
                is NetworkResult.Success -> {
                    _popular.value = result.data.data
                    Log.d(TAG, "Popular: ${_popular.value}")
                }

                is NetworkResult.Error -> {
                    _error.value = result.message
                }

                NetworkResult.Loading -> Unit
            }

            /**
             * After handle result
             * Set loading to false
             */
            _popularLoading.value = false
        }
    }

    fun loadProductDetail(productID: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _productDetailLoading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.getProductDetailByProductID(productID)) {
                is NetworkResult.Success -> {
                    _productDetail.value = result.data
                    Log.d(TAG, "Popular: ${_productDetail.value}")
                }

                is NetworkResult.Error -> {
                    _error.value = result.message
                }

                NetworkResult.Loading -> Unit
            }

            /**
             * After handle result
             * Set loading to false
             */
            _productDetailLoading.value = false
        }
    }
}