/**
 * @description Brand view model factory
 * @since 2026-01-09
 * @author @nhuttan12
 * @version: 1.0.0
 */

package com.example.e_commerce.ViewModel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.e_commerce.Helper.TinyDB

class BannerViewModelFactory() : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(BannerViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return BannerViewModel() as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}