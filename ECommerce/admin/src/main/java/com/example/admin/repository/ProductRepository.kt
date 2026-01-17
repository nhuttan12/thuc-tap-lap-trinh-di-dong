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
                val response = service.getProducts(page = page)

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

                Log.d("ProductRepository", "Got ${productDTOs.size} products")
                ProductMapper.toProductList(productDTOs)
            } catch (e: Exception) {
                Log.e("ProductRepository", "Get products error: ${e.message}", e)
                throw e
            }
        }
    }

    suspend fun getProductDetail(id: Int): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "Getting product detail for ID: $id")
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

                // Chuyển đổi ProductDetailDTO → Product
                // Có thể tạo mapper riêng hoặc dùng cách tạm thời
                Product(
                        id = productDetailDTO.id,
                        name = productDetailDTO.name,
                        price = productDetailDTO.price,
                        discount = productDetailDTO.discount,
                        status = "ACTIVE", // API public không có status
                        description = productDetailDTO.description,
                        imageUrl = productDetailDTO.imageList.firstOrNull() ?: "",
                        category = "",
                        size = productDetailDTO.size.joinToString(","),
                        color = productDetailDTO.color
                )
            } catch (e: Exception) {
                Log.e("ProductRepository", "Get product detail error: ${e.message}", e)
                throw e
            }
        }
    }

    suspend fun createProduct(request: CreateProductRequest): Product {
        return withContext(Dispatchers.IO) {
            try {
                Log.d("ProductRepository", "=== CREATE PRODUCT REQUEST ===")
                Log.d("ProductRepository", "Request: ${Gson().toJson(request)}")

                val response = service.createProduct(request)

                Log.d("ProductRepository", "Create product response code: ${response.code()}")

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    Log.e("ProductRepository", "Create product failed: HTTP ${response.code()}: $errorBody")
                    throw Exception("HTTP ${response.code()}: $errorBody")
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    throw Exception(apiResponse?.message ?: "Response body is null or not success")
                }

                val productDTO = apiResponse.data ?: throw Exception("Product data is null")
                Log.d("ProductRepository", "Product created: id=${productDTO.id}, name=${productDTO.name}")

                ProductMapper.toProduct(productDTO)
            } catch (e: Exception) {
                Log.e("ProductRepository", "Create product error: ${e.message}", e)
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
}