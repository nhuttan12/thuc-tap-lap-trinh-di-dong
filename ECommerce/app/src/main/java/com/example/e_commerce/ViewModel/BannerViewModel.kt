package com.example.e_commerce.ViewModel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Repository.BannerRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class BannerViewModel : ViewModel() {
    private val repository = BannerRepository()

    private val TAG = "BannerViewModel"

    private var _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private var _loading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val loading: MutableLiveData<Boolean> get() = _loading

    private val _banners = MutableLiveData<List<SliderModel>>()
    val banners: LiveData<List<SliderModel>> get() = _banners

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

}