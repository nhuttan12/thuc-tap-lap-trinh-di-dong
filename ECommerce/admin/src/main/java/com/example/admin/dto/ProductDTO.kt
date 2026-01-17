package com.example.admin.dto

import com.google.gson.annotations.SerializedName

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
) {
    init {
        // Debug constructor
        println("🔄 ProductDTO created: id=$id, name=$name")
    }
}

data class ProductDetailsDTO(
        val id: Int = 0,

        // SỬA: Chuyển từ List<String> sang String
        @SerializedName("size")
        val size: String = "",

        @SerializedName("color")
        val color: String = "Đen",

        @SerializedName("rating")
        val rating: Float = 0f,

        @SerializedName("description")
        val description: String = "",

        @SerializedName("categoryEntity")
        val categoryEntity: CategoryDTO? = null
) {
    // ✅ Helper method để chuyển string thành list
    fun getSizeList(): List<String> {
        return if (size.isBlank()) emptyList()
        else size.split(",").map { it.trim() }.filter { it.isNotBlank() }
    }

    // ✅ Helper method để chuyển list thành string
    companion object {
        fun fromSizeList(sizeList: List<String>): String {
            return sizeList.joinToString(",")
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