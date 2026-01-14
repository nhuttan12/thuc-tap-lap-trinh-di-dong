package com.example.admin.repository

import com.example.admin.model.Product
import com.example.admin.dto.ProductDTO
import com.example.admin.helper.NetworkHelper
import com.example.admin.mapper.ProductMapper
import com.example.admin.service.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProductRepository {

    private val service = ApiService.productService

    suspend fun getProducts(page: Int = 1): kotlin.Result<List<Product>> {
        return withContext(Dispatchers.IO) {
            try {
                NetworkHelper.logRequest("admin/products?page=$page", "GET")

                val response = service.getProducts(page = page)

                NetworkHelper.logResponse(response.code(), response.message())

                if (response.isSuccessful) {
                    val body = response.body()

                    if (body?.success == true) {
                        val pagingResponse = body.data
                        val productDTOs = pagingResponse?.data ?: listOf<ProductDTO>()

                        NetworkHelper.logResponse(
                                response.code(),
                                "Found ${productDTOs.size} products"
                        )

                        val productModels = ProductMapper.toProductList(productDTOs)
                        kotlin.Result.success(productModels)
                    } else {
                        val errorMsg = body?.message ?: "Lỗi không xác định"
                        NetworkHelper.logError("Repository", errorMsg)
                        kotlin.Result.failure(Exception(errorMsg))
                    }
                } else {
                    val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                    NetworkHelper.logError("Repository", errorMsg)
                    kotlin.Result.failure(Exception(errorMsg))
                }
            } catch (e: Exception) {
                NetworkHelper.logError("Repository", "Network error: ${e.message}", e)
                kotlin.Result.failure(e)
            }
        }
    }

    suspend fun deleteProduct(id: Int): kotlin.Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                val response = service.deleteProduct(id)

                if (response.isSuccessful && response.body()?.success == true) {
                    kotlin.Result.success(Unit)
                } else {
                    kotlin.Result.failure(Exception("Xóa thất bại"))
                }
            } catch (e: Exception) {
                kotlin.Result.failure(e)
            }
        }
    }
}