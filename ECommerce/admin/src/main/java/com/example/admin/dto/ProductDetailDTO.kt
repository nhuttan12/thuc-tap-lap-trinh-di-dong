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

        // SỬA: Nhận array từ BE, chuyển thành string
        @SerializedName("size") val size: List<String> = emptyList(),

        // SỬA: Nhận array từ BE, chuyển thành string
        @SerializedName("color") val color: List<String> = emptyList(),

        @SerializedName("description") val description: String = "",

        @SerializedName("imageList") val imageList: List<String> = emptyList()
)