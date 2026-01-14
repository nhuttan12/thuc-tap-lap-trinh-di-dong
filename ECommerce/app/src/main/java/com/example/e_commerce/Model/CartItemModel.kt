package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass

data class CartItemModel(
    var id: Int = 0,
    var title: String = "",
    var picUrl: String = "",
    var price: Double = 0.0,
    var numberInCart: Int = 1,
    var isUpdating: Boolean = false
)
