package com.example.e_commerce.ViewModel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Repository.BrandRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class BrandViewModel : ViewModel() {
    private val repository = BrandRepository()

    private val TAG = "BrandViewModel"

    private val _brands = MutableLiveData<List<BrandModel>>()

    val brands: LiveData<List<BrandModel>> get() = _brands

    private var _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private var _loading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
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
}