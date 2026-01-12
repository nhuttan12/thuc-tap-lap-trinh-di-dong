/**
 * @description Cart view model
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
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Repository.CartRepository
import com.example.e_commerce.Result.NetworkResult
import kotlinx.coroutines.launch

class CartViewModel(
    private val tinyDB: TinyDB
) : ViewModel() {

    private val repository = CartRepository(
        tinyDB
    )

    private val _cartItem = MutableLiveData<List<CartItemModel>>()
    val cartItem: LiveData<List<CartItemModel>> get() = _cartItem

    private val _addProductToCartMsg: MutableLiveData<String> = MutableLiveData<String>()
    val addProductToCartMsg: LiveData<String> get() = _addProductToCartMsg

    private val _removeProductFromCart: MutableLiveData<Boolean> = MutableLiveData<Boolean>()
    val removeProductFromCart: LiveData<Boolean> get() = _removeProductFromCart

    private val _updateQuantityProductDetail: MutableLiveData<CartItemModel> =
        MutableLiveData<CartItemModel>()
    val updateQuantityProductDetail: LiveData<CartItemModel> get() = _updateQuantityProductDetail

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    fun loadUserCart(limit: Int, page: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result = repository.loadCart(limit = limit, page = page)) {
                is NetworkResult.Success -> {
                    mergeAfterReload(result.data.data)
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

    fun addProductToCart(productID: Int, quantity: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result =
                repository.addProductToCart(productID = productID, quantity = quantity)) {
                is NetworkResult.Success -> {
                    _addProductToCartMsg.value = result.data
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

    fun removeProductFromCart(cartDetailID: Int) {
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
                repository.removeProductFromCart(cartDetailID = cartDetailID)) {
                is NetworkResult.Success -> {
                    _removeProductFromCart.value = result.data
                    loadUserCart(20, 1)
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

    fun updateQuantityOfCartDetail(cartDetailID: Int, quantity: Int) {
        viewModelScope.launch {
            /**
             * Set loading to true
             */
            _loading.value = true

            /**
             * Call repository to load brands
             * Handle result
             */
            when (val result: NetworkResult<CartItemModel> =
                repository.updateQuantityOfCartDetail(
                    cartDetailID = cartDetailID,
                    quantity = quantity
                )) {
                is NetworkResult.Success -> {
                    _updateQuantityProductDetail.value = result.data
                    loadUserCart(20, 1)
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

    fun onIncrease(item: CartItemModel) {
        markItemUpdating(item.id, true)

        updateQuantityOfCartDetail(
            cartDetailID = item.id,
            quantity = item.numberInCart + 1
        )
    }

    fun onDecrease(item: CartItemModel) {
        markItemUpdating(item.id, true)

        if (item.numberInCart <= 1) {
            removeProductFromCart(item.id)
        } else {
            updateQuantityOfCartDetail(
                cartDetailID = item.id,
                quantity = item.numberInCart - 1
            )
        }
    }

    private fun markItemUpdating(cartDetailID: Int, updating: Boolean) {
        val current = _cartItem.value ?: return

        _cartItem.value = current.map {
            if (it.id == cartDetailID) {
                it.copy(isUpdating = updating)
            } else it
        }
    }

    private fun mergeAfterReload(newList: List<CartItemModel>) {
        _cartItem.value = newList.map {
            it.copy(isUpdating = false)
        }
    }
}