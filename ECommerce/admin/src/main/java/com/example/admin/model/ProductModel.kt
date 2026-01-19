package com.example.admin.model

data class Product(
        val id: Int = 0,
        val name: String = "",
        val price: Double = 0.0,
        val discount: Double = 0.0,
        val status: String = "ACTIVE",
        val size: String = "39; 40; 41",
        val color: String = "Đen; Trắng",
        val description: String = "Sản phẩm chất lượng cao",
        val rating: Float = 4.5f,
        val category: String = "Thể thao",
        val categoryId: Int = 1,
        val brand: String = "Adidas",
        val brandId: Int = 2,
        val imageUrl: String = "https://bizweb.dktcdn.net/100/347/092/products/giay-lightblaze-moc-djen-jh7039-02-standard-hover-11zon.jpg?v=1764135084707"
) {
    fun hasDiscount(): Boolean = discount > 0

    fun getFinalPrice(): Double = if (discount > 0) {
        price * (1 - discount / 100)
    } else {
        price
    }
}