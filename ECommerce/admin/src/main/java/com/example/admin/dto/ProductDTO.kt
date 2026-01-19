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

// ProductDetailsDTO.kt
data class ProductDetailsDTO(
        val id: Int = 0,
        val size: String = "",
        val color: String = "",
        val rating: Float = 0f,
        val description: String = "",
        val categoryEntity: CategoryDTO? = null,
        val brandEntity: BrandDTO? = null
) {
    //Helper method để chuyển string thành list (xử lý cả ";" và ",")
    fun getSizeList(): List<String> {
        return if (size.isBlank()) emptyList()
        else {
            // Xử lý cả 2 loại delimiter
            if (size.contains(";")) {
                size.split(";").map { it.trim() }.filter { it.isNotBlank() }
            } else {
                size.split(",").map { it.trim() }.filter { it.isNotBlank() }
            }
        }
    }

    //Helper method để chuyển color string thành list
    fun getColorList(): List<String> {
        return if (color.isBlank()) listOf("Đen")
        else {
            // Xử lý cả 2 loại delimiter
            if (color.contains(";")) {
                color.split(";").map { it.trim() }.filter { it.isNotBlank() }
            } else {
                // Nếu không có delimiter, coi như một màu
                listOf(color.trim())
            }
        }
    }

    // ✅ Helper method để chuyển list thành string với delimiter "; "
    companion object {
        fun fromSizeList(sizeList: List<String>): String {
            return sizeList.joinToString("; ")
        }

        fun fromColorList(colorList: List<String>): String {
            return colorList.joinToString("; ")
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