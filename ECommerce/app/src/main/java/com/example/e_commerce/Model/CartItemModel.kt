package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass
import java.io.Serializable

@JsonClass(generateAdapter = true)
data class CartItemModel(
    var title: String = "",
    var picUrl: String = "",
    var price: Double = 0.0,
    var numberInCart: Int = 1
) : Serializable
