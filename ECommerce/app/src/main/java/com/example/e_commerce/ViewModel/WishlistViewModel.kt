/**
 * @description Wishlist view model
 * @author @nhuttan12
 * @since 2026-01-12
 * @version 1.0.0
 */

package com.example.e_commerce.ViewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.DTOs.Response.PagingResponse
import com.example.e_commerce.Repository.WishlistRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class WishlistViewModel(
    private val tinyDB: TinyDB
) : ViewModel() {
    private val repository = WishlistRepository(
        tinyDB
    )

    private val KEY_WISHLIST_IDS = "WISHLIST_IDS"

    private var _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    private var _loading: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val loading: MutableLiveData<Boolean> get() = _loading

    private val _wishlistItem = MutableLiveData<List<ProductModel>>()
    val wishlistItem: LiveData<List<ProductModel>> get() = _wishlistItem
    private val _addProductToWishlist: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val addProductToWishlistMsg: LiveData<Boolean> get() = _addProductToWishlist

    private val _removeProductFromWishlist: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val removeProductFromWishlistMsg: LiveData<Boolean> get() = _removeProductFromWishlist

    private val _wishlistIds = MutableLiveData<Set<Int>>()
    val wishlistIds: LiveData<Set<Int>> = _wishlistIds

    fun loadWishlist(limit: Int, page: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result: NetworkResult<PagingResponse<ProductModel>> =
                repository.loadWishlist(limit = limit, page = page)) {
                is NetworkResult.Success -> {
                    _wishlistItem.value = result.data.data
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

    fun addProductToWishlist(productID: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result: NetworkResult<Boolean> =
                repository.addProductToWishlist(productID = productID)) {
                is NetworkResult.Success -> {
                    val current = _wishlistIds.value ?: emptySet()
                    val updated = current + productID

                    tinyDB.putListInt("WISHLIST_IDS", updated.toList())
                    _wishlistIds.value = updated

                    _addProductToWishlist.value = result.data
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

    fun removeProductFromWishlist(productID: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result: NetworkResult<Boolean> =
                repository.removeWishlistItem(productID = productID)) {
                is NetworkResult.Success -> {
                    val current = _wishlistIds.value ?: emptySet()
                    val updated = current - productID

                    tinyDB.putListInt("WISHLIST_IDS", updated.toList())
                    _wishlistIds.value = updated

                    _removeProductFromWishlist.value = result.data
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

    fun loadWishlistIds() {
        val ids = tinyDB.getListInt(KEY_WISHLIST_IDS)?.toSet() ?: emptySet()
        _wishlistIds.postValue(ids)
    }
}