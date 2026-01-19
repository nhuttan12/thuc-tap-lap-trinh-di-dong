package com.example.admin.dto

data class ProductDTO(
        val id: Int = 0,
        val name: String = "",
        val price: Double = 0.0,
        val discount: Double = 0.0,
        val status: String = "ACTIVE",
        val productDetailsEntity: ProductDetailsDTO? = null,
        val productImages: List<ProductImageDTO>? = null,
        val createdAt: String? = null,
        val updatedAt: String? = null
){
    init {
        // Debug constructor
        println("ProductDTO created: id=$id, name=$name")
    }
}

data class ProductDetailsDTO(
        val id: Int = 0,
        val size: String = "",
        val color: String = "",
        val rating: Float = 0f,
        val description: String = "",
        val categoryEntity: CategoryDTO? = null,
        val brandEntity: BrandDTO? = null
) {
    // Helper để chuyển size string thành list
    fun getSizeList(): List<String> {
        if (size.isBlank()) return emptyList()
        return if (size.contains(";")) {
            size.split(";").map { it.trim() }.filter { it.isNotBlank() }
        } else {
            listOf(size.trim())
        }
    }

    // Helper để chuyển color string thành list
    fun getColorList(): List<String> {
        if (color.isBlank()) return listOf("Đen")
        return if (color.contains(";")) {
            color.split(";").map { it.trim() }.filter { it.isNotBlank() }
        } else {
            listOf(color.trim())
        }
    }
}
data class ProductImageDTO(
        val id: Int = 0,
        val type: String = "THUMBNAIL",
        val image: ImageDTO? = null
)

data class ImageDTO(
        val id: Int = 0,
        val url: String = "",
        val status: String = "ACTIVE"
)

data class CategoryDTO(
        val id: Int = 0,
        val name: String = ""
)

data class BrandDTO(
        val id: Int = 0,
        val name: String = ""
)