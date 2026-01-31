package com.example.e_commerce.Model

import java.math.BigDecimal

data class CartItemModel(
    var id: Int = 0,
    var title: String = "",
    var picUrl: String = "",
    var price: BigDecimal = BigDecimal.ZERO,
    var numberInCart: Int = 1,
    var isUpdating: Boolean = false
)
