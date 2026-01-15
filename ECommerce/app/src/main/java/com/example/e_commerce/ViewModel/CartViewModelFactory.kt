/**
 * @description Main view model factory
 * @since 2026-01-09
 * @author @nhuttan12
 * @version: 1.0.0
 */

package com.example.e_commerce.ViewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.e_commerce.Helper.TinyDB

class CartViewModelFactory(
    private val tinyDB: TinyDB
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CartViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CartViewModel(tinyDB) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}