// ProductRepository.kt
package com.example.admin.repository

import android.util.Log
import com.example.admin.mapper.ProductMapper
import com.example.admin.model.Product
import com.example.admin.service.ApiService
import com.example.admin.service.CreateProductRequest
import com.example.admin.service.UpdateProductRequest
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProductRepository {

    private val service = ApiService.productService

    suspend fun getProducts(page: Int = 1): List<Product> {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Getting products page: $page")
                val response = service.getProductsForAdmin(page = page, limit = 20)

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Lỗi không xác định")
                }

                val pagingResponse = apiResponse.data
                val productDTOs = pagingResponse?.data ?: emptyList()

                Log.d("ProductRepository", "Got ${productDTOs.size} products from list API")

                // Đơn giản: chỉ map từ DTO, không gọi API detail nữa
                return@withContext ProductMapper.toProductList(productDTOs)

            } catch (e: Exception) {
                Log.e("ProductRepository", "Get products error: ${e.message}", e)
                throw e
            }
        }
    }

    /**
     * Get product detail từ API public (có size, color là array)
     */
    suspend fun getProductDetail(id: Int): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Getting product detail for ID: $id")
                val response = service.getProductDetail(id)

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    Log.e("ProductRepository", "Detail API failed: HTTP ${response.code()}: $errorBody")
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Response body is null")
                }

                val productDetailDTO = apiResponse.data ?: throw Exception("Product data is null")

                Log.d("ProductRepository", "Detail response: size=${productDetailDTO.size}, color=${productDetailDTO.color}")

                // CHUYỂN ARRAY THÀNH STRING VỚI DELIMITER "; "
                val sizeString = if (productDetailDTO.size.isNotEmpty()) {
                    productDetailDTO.size.joinToString("; ")
                } else {
                    ""
                }

                val colorString = if (productDetailDTO.color.isNotEmpty()) {
                    productDetailDTO.color.joinToString("; ")
                } else {
                    ""
                }

                return@withContext Product(
                        id = productDetailDTO.id,
                        name = productDetailDTO.name,
                        price = productDetailDTO.price,
                        discount = productDetailDTO.discount,
                        status = "ACTIVE", // API public không có status
                        description = productDetailDTO.description ?: "",
                        imageUrl = productDetailDTO.imageList.firstOrNull() ?: "",
                        category = "Thể thao", // Có thể lấy từ API sau
                        categoryId = 1,
                        size = sizeString, // ĐÃ CHUYỂN THÀNH STRING
                        color = colorString, // ĐÃ CHUYỂN THÀNH STRING
                        brand = "Adidas", // Mặc định
                        brandId = 2,
                        rating = productDetailDTO.rating ?: 0f
                )
            } catch (e: Exception) {
                Log.e("ProductRepository", "Get product detail error: ${e.message}", e)
                throw e
            }
        }
    }

    suspend fun getProductDetailForAdmin(id: Int): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Getting product detail for admin ID: $id")

                // THỬ GỌI API ADMIN DETAIL TRƯỚC
                try {
                    val adminResponse = service.getProductDetailForAdmin(id)
                    if (adminResponse.isSuccessful) {
                        val apiResponse = adminResponse.body()
                        if (apiResponse?.success == true && apiResponse.data != null) {
                            val product = ProductMapper.toProduct(apiResponse.data!!)
                            Log.d("ProductRepository", "Got admin detail for $id")
                            return@withContext product
                        }
                    }
                } catch (e: Exception) {
                    Log.w("ProductRepository", "Admin detail API failed, trying public API")
                }

                // NẾU API ADMIN KHÔNG CÓ, DÙNG API PUBLIC
                val response = service.getProductDetail(id)

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Response body is null")
                }

                val productDetailDTO = apiResponse.data ?: throw Exception("Product data is null")

                // Chuyển đổi từ ProductDetailDTO sang Product
                return@withContext Product(
                        id = productDetailDTO.id,
                        name = productDetailDTO.name,
                        price = productDetailDTO.price,
                        discount = productDetailDTO.discount,
                        status = "ACTIVE",
                        description = productDetailDTO.description ?: "",
                        imageUrl = productDetailDTO.imageList.firstOrNull() ?: "",
                        category = "Thể thao",
                        categoryId = 1,
                        size = if (productDetailDTO.size.isNotEmpty()) {
                            productDetailDTO.size.joinToString("; ")
                        } else {
                            getFallbackSize(productDetailDTO.id)
                        },
                        color = if (productDetailDTO.color.isNotEmpty()) {
                            productDetailDTO.color.joinToString("; ")
                        } else {
                            getFallbackColor(productDetailDTO.id)
                        },
                        brand = "Adidas",
                        brandId = 2,
                        rating = productDetailDTO.rating ?: 0f
                )
            } catch (e: Exception) {
                Log.e("ProductRepository", "Get product detail error: ${e.message}", e)
                throw e
            }
        }
    }

    // Helper functions cho fallback data
    private fun getFallbackSize(productId: Int): String {
        val sizes = listOf("39; 40; 41", "40; 41; 42", "37; 38; 39", "42; 43; 44")
        return sizes[productId % sizes.size]
    }

    private fun getFallbackColor(productId: Int): String {
        val colors = listOf("Đen; Trắng", "Xanh; Đỏ", "Đen; Xám", "Nâu; Be")
        return colors[productId % colors.size]
    }
    /**
     * Tạo sản phẩm mới
     */
    suspend fun createProduct(request: CreateProductRequest): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Creating product: ${request.name}")
                val response = service.createProduct(request)

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Response body is null")
                }

                val productDTO = apiResponse.data ?: throw Exception("Product data is null")

                // Map từ response
                return@withContext ProductMapper.toProduct(productDTO)

            } catch (e: Exception) {
                Log.e("ProductRepository", "Create product error", e)
                throw e
            }
        }
    }

    suspend fun updateProduct(id: Int, request: UpdateProductRequest): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "=== UPDATE PRODUCT REQUEST ===")
                Log.d("ProductRepository", "Product ID: $id, Request: ${Gson().toJson(request)}")

                val response = service.updateProduct(id, request)

                Log.d("ProductRepository", "Update product response code: ${response.code()}")

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    Log.e("ProductRepository", "Update product failed: HTTP ${response.code()}: $errorBody")
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Response body is null or not success")
                }

                val productDTO = apiResponse.data ?: throw Exception("Product data is null")
                Log.d("ProductRepository", "Product updated: id=${productDTO.id}, name=${productDTO.name}")

                ProductMapper.toProduct(productDTO)
            } catch (e: Exception) {
                Log.e("ProductRepository", "Update product error: ${e.message}", e)
                throw e
            }
        }
    }


    suspend fun deleteProduct(id: Int): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Deleting product ID: $id")
                val response = service.deleteProduct(id)

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Delete failed")
                }

                Log.d("ProductRepository", "Product deleted successfully: ID=$id")
                true
            } catch (e: Exception) {
                Log.e("ProductRepository", "Delete product error: ${e.message}", e)
                throw e
            }
        }
    }

    suspend fun searchProducts(keyword: String, page: Int = 1): List<Product> {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Searching products for keyword: $keyword, page: $page")

                // TH1: Gọi API search nếu có
                // val response = service.searchProducts(keyword = keyword, page = page, limit = 20)

                // TH2: Tạm thời lấy tất cả và filter trên client (nếu chưa có API search)
                val response = service.getProductsForAdmin(page = page, limit = 50) // Lấy nhiều hơn để search

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Lỗi không xác định")
                }

                val pagingResponse = apiResponse.data
                val productDTOs = pagingResponse?.data ?: emptyList()

                // Filter trên client nếu chưa có API search
                val filteredDTOs = if (keyword.isNotEmpty()) {
                    productDTOs.filter { productDTO ->
                        productDTO.name?.contains(keyword, ignoreCase = true) == true
                    }
                } else {
                    productDTOs
                }

                Log.d("ProductRepository", "Found ${filteredDTOs.size} products for keyword '$keyword'")

                // Map từ DTO sang Product
                return@withContext ProductMapper.toProductList(filteredDTOs)

            } catch (e: Exception) {
                Log.e("ProductRepository", "Search products error: ${e.message}", e)
                throw e
            }
        }
    }
}