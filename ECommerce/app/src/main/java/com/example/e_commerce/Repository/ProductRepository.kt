/**
 * @description Product repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import com.example.e_commerce.DTOs.ProductDTO
import com.example.e_commerce.Mappers.ProductMapper
import com.example.e_commerce.Model.ApiResponse
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class ProductRepository : BaseRepository() {
    /**
     * @description Call api and handle result
     *
     * @return [NetworkResult] result of brand list
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2025-12-24
     * @author @nhuttan12
     * @version 1.0.0
     */
    suspend fun loadPopular(): NetworkResult<List<ProductModel>> {
        return try {
            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiResponse<List<ProductDTO>>> = ApiClient.productService.getProducts()

            /**
             * Handle response
             */
            handleApiResponse(response) { dtoList ->
                ProductMapper.fromDtoList(dtoList)
            }
        } catch (e: IOException) {
            e.printStackTrace()
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}