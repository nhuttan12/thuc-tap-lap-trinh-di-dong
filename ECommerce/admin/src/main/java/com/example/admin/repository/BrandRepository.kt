package com.example.admin.repository

import android.util.Log
import com.example.admin.dto.BrandDTO
import com.example.admin.service.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class BrandRepository {
    private val service = ApiService.brandService

    suspend fun getBrands(limit: Int = 20): List<BrandDTO> {  // SỬA: BrandDTO thay vì Brand
        return withContext(Dispatchers.IO) {
            try {
                Log.d("BrandRepository", "Loading brands from API...")
                val response = service.getBrands()

                if (!response.isSuccessful) {
                    val errorBody = response.errorBody()?.string()
                    Log.e("BrandRepository", "Failed to load brands: HTTP ${response.code()}: $errorBody")
                    return@withContext emptyList()
                }

                val apiResponse = response.body()
                if (apiResponse == null || apiResponse.success != true) {
                    Log.e("BrandRepository", "API response error: ${apiResponse?.message}")
                    return@withContext emptyList()
                }

                val brands = apiResponse.data ?: emptyList()
                Log.d("BrandRepository", "Loaded ${brands.size} brands")
                return@withContext brands

            } catch (e: Exception) {
                Log.e("BrandRepository", "Error loading brands: ${e.message}", e)
                return@withContext emptyList()
            }
        }
    }
}