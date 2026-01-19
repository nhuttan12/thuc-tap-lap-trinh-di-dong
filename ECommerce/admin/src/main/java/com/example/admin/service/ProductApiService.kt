package com.example.admin.service

import com.example.admin.dto.ApiSuccess
import com.example.admin.dto.PagingResponse
import com.example.admin.dto.ProductDTO
import com.example.admin.dto.ProductDetailDTO
import retrofit2.Response
import retrofit2.http.*

interface ProductApiService {

    @GET("products/admin")
    suspend fun getProducts(
            @Query("page") page: Int = 1,
            @Query("limit") limit: Int = 20
    ): Response<ApiSuccess<PagingResponse<ProductDTO>>>

    // API PUBLIC - trả về ProductDetailDTO (cho product detail)
    @GET("products/{id}")
    suspend fun getProductDetail(
            @Path("id") id: Int
    ): Response<ApiSuccess<ProductDetailDTO>>

    @POST("products/admin")
    suspend fun createProduct(
            @Body body: CreateProductRequest
    ): Response<ApiSuccess<ProductDTO>>

    @PUT("products/admin/{id}")
    suspend fun updateProduct(
            @Path("id") id: Int,
            @Body body: UpdateProductRequest
    ): Response<ApiSuccess<ProductDTO>>

    @DELETE("products/admin/{id}")
    suspend fun deleteProduct(
            @Path("id") id: Int
    ): Response<ApiSuccess<Void>>
}

// Các data class ĐẶT NGOÀI interface (giống UserApiService)

// CreateProductRequest.kt - THÊM rating
// UpdateProductRequest.kt
data class UpdateProductRequest(
        val name: String? = null,
        val price: Double? = null,
        val discount: Double? = null,
        val rating: Float? = null,
        val status: String? = null,
        val brand_id: Int? = null,
        val size: String? = null,        // Cho phép null
        val color: String? = null,       // Cho phép null
        val description: String? = null,
        val category_id: Int? = null
)

// CreateProductRequest.kt
data class CreateProductRequest(
        val name: String,
        val price: Double,
        val discount: Double,
        val rating: Float? = null,
        val status: String,
        val category_id: Int? = null,
        val brand_id: Int? = null,
        val size: String? = null,        // Cho phép null
        val color: String? = null,       // Cho phép null
        val description: String? = null
)

data class ProductDetailsRequest(
        val size: String? = null,
        val color: String? = null,
        val description: String? = null,
        val rating: Float? = null,
        val category_id: Int? = null
)

data class ProductImageRequest(
        val type: String = "THUMBNAIL",
        val image: ImageRequest? = null
)

data class ImageRequest(
        val url: String
)

// Thêm data class Brand
data class Brand(
        val id: Int,
        val name: String
)