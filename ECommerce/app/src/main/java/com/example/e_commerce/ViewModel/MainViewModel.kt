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
import android.widget.Toast
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Repository.BannerRepository
import com.example.e_commerce.Repository.BrandRepository
import com.example.e_commerce.Repository.CartRepository
import com.example.e_commerce.Repository.MainRepository
import com.example.e_commerce.Repository.PagingResponse
import com.example.e_commerce.Repository.ProductRepository
import com.example.e_commerce.Repository.WishlistRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class MainViewModel(
    private val tinyDB: TinyDB
) : ViewModel() {
    private val repository = MainRepository(
        brandRepository = BrandRepository(),
        bannerRepository = BannerRepository(),
        productRepository = ProductRepository(),
        cartRepository = CartRepository(tinyDB),
        wishlistRepository = WishlistRepository(tinyDB)
    )
    private val TAG = "MainViewModel"

    private val _brands = MutableLiveData<List<BrandModel>>()
    private val _banners = MutableLiveData<List<SliderModel>>()
    private val _popular = MutableLiveData<List<ProductModel>>()
    private val _productDetail = MutableLiveData<ProductDetailModel>()
    private var _error = MutableLiveData<String>()
    private var _loading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()

    val brands: LiveData<List<BrandModel>> get() = _brands
    val banners: LiveData<List<SliderModel>> get() = _banners
    val popular: LiveData<List<ProductModel>> get() = _popular
    val productDetail: LiveData<ProductDetailModel> get() = _productDetail
    val error: LiveData<String> get() = _error
    val loading: MutableLiveData<Boolean> get() = _loading

    fun loadBrands(limit: Int = 10) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true
            _brands.value = emptyList()
            Log.d(TAG, "Loading brands status: ${_loading.value}")

            /**
             * Call repository to load brands
             * Handle result
             */
            val result: NetworkResult<List<BrandModel>> = repository.loadBrands(limit)
            Log.d(TAG, "Result: $result")

            when (result) {
                is NetworkResult.Success -> {
                    _brands.value = result.data.toList()
                    Log.d(TAG, "Loading brands value: ${_brands.value}")
                }

                is NetworkResult.Error -> {
                    _error.value = result.message
                    Log.d(TAG, "Show error message: ${_brands.value}")
                }

                NetworkResult.Loading -> Unit
            }

            /**
             * After handle result
             * Set loading to false
             */
            _loading.value = false
        }
    }

    fun loadBanners() {
        viewModelScope.launch {
            _loading.value = true
            _banners.value = emptyList()
            Log.d(TAG, "Loading brands status: ${_loading.value}")

            /**
             * Call repository to load brands
             * Handle result
             */
            val result: NetworkResult<List<SliderModel>> = repository.loadBanners()
            Log.d(TAG, "Result: $result")

            when (result) {
                is NetworkResult.Success -> {
                    _banners.value = result.data.toList()
                    Log.d(TAG, "Loading brands value: ${_banners.value}")
                }

                is NetworkResult.Error -> {
                    _error.value = result.message
                    Log.d(TAG, "Show error message: ${_banners.value}")
                }

                NetworkResult.Loading -> Unit
            }

            /**
             * After handle result
             * Set loading to false
             */
            _loading.value = false
        }
    }

    fun loadPopular() {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadPopular()) {
                is NetworkResult.Success -> {
                    _popular.value = result.data.data
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
            _loading.value = false
        }
    }

    fun loadProductDetail(productID: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadProductDetail(productID)) {
                is NetworkResult.Success -> {
                    _productDetail.value = result.data
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
            _loading.value = false
        }
    }
}