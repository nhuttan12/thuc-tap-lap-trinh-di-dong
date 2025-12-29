/**
 * @description Main view model for connecting to Repository and display data to view
 * @author @nhuttan12
 * @since 2025-08-27
 * @modifies 2025-11-06
 * @version 1.0.1
 */

package com.example.e_commerce.ViewModel

import android.widget.Toast
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Repository.BannerRepository
import com.example.e_commerce.Repository.BrandRepository
import com.example.e_commerce.Repository.MainRepository
import com.example.e_commerce.Repository.ProductRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class MainViewModel: ViewModel() {
    private val repository = MainRepository(
        brandRepository = BrandRepository(),
        bannerRepository = BannerRepository(),
        productRepository = ProductRepository()
    )

    private val _brands = MutableLiveData<List<BrandModel>>()
    private val _banners = MutableLiveData<List<SliderModel>>()
    private val _popular = MutableLiveData<List<ProductModel>>()
    private var _error  = MutableLiveData<String>()
    private var _loading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()

    val brands: LiveData<List<BrandModel>> get() = _brands
    val banners: LiveData<List<SliderModel>> get() = _banners
    val popular: LiveData<List<ProductModel>> get() = _popular
    val error: LiveData<String> get() = _error
    val loading: MutableLiveData<Boolean> get() = _loading

    fun loadBrands(limit: Int = 10) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.postValue(true)

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadBrands(limit)) {
                is NetworkResult.Success -> {
                    _brands.postValue(result.data)
                }
                is NetworkResult.Error -> {
                    _error.postValue(result.message)
                }
                NetworkResult.Loading -> {
                }
            }

            /**
             * After handle result
             * Set loading to false
             */
            _loading.postValue(false)
        }
    }

    fun loadBanners() = repository.loadBanners()

    fun loadPopular() {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.postValue(true)

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadPopular()) {
                is NetworkResult.Success -> {
                    _popular.postValue(result.data.data)
                }
                is NetworkResult.Error -> {
                    _error.postValue(result.message)
                }
                NetworkResult.Loading -> {
                }
            }

            /**
             * After handle result
             * Set loading to false
             */
            _loading.postValue(false)
        }
    }

}