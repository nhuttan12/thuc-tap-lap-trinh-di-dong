package com.example.admin.model

data class Product(
        val id: Int = 0,
        val name: String = "",
        val price: Double = 0.0,
        val discount: Double = 0.0,
        val status: String = "ACTIVE",
        val size: String = "",      // KHÔNG set mặc định "37"
        val color: String = "",     // KHÔNG set mặc định "Đen"
        val description: String = "",
        val rating: Float = 0f,
        val category: String = "",   // KHÔNG set mặc định
        val categoryId: Int = 0,     // 0 thay vì 1
        val brand: String = "",      // KHÔNG set mặc định
        val brandId: Int = 0,        // 0 thay vì 2
        val imageUrl: String = ""
) {
    fun hasDiscount(): Boolean = discount > 0

    fun getFinalPrice(): Double = if (discount > 0) {
        price * (1 - discount / 100)
    } else {
        price
    }
}