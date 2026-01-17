package com.example.admin.dto
import com.google.gson.annotations.SerializedName

data class ProductDetailResponse(
        @SerializedName("data")
        val data: ProductDetailDTO? = null
)

data class ProductDetailDTO(
        val id: Int = 0,
        val name: String = "",
        val price: Double = 0.0,
        val discount: Double = 0.0,
        val rating: Float = 0f,

        @SerializedName("size")
        val size: List<String> = emptyList(),  // Array từ API public

        @SerializedName("color")
        val color: String = "",

        @SerializedName("description")
        val description: String = "",

        @SerializedName("imageList")
        val imageList: List<String> = emptyList()
)