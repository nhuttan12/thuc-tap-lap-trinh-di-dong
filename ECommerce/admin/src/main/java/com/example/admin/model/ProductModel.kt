package com.example.admin.model

import java.io.Serializable

data class Product(
        val id: Int = 0,
        val name: String = "",
        val price: Double = 0.0,
        val discount: Double = 0.0,
        val status: String = "ACTIVE",
        val description: String = "",
        val imageUrl: String = "",
        val category: String = "",
        val size: String = "M",
        val color: String = "Đen"
) : Serializable {

    fun getFinalPrice(): Double {
        return price * (1 - discount / 100)
    }

    fun hasDiscount(): Boolean {
        return discount > 0
    }
}