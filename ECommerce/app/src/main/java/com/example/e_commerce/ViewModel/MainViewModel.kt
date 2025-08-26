package com.example.e_commerce.ViewModel

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.ItemModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Repository.MainRepository

class MainViewModel: ViewModel() {
    private val repository = MainRepository()

    val brands: LiveData<MutableList<BrandModel>> = repository.brands
    val banners: LiveData<List<SliderModel>> = repository.banners
    val popular: LiveData<List<ItemModel>> = repository.popular

    fun loadBrands() = repository.loadBrands()
    fun loadBanners() = repository.loadBanners()
    fun loadPopular() = repository.loadPopular()
}