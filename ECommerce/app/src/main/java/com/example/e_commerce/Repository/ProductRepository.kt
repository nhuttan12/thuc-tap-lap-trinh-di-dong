/**
 * @description Product repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.DTOs.ProductDTO
import com.example.e_commerce.Mappers.ProductMapper
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class ProductRepository : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "BrandRepository"

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
    suspend fun loadPopular(
        limit: Int,
        page: Int
    ): NetworkResult<PagingResponse<ProductModel>> {
        return try {
            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<PagingResponse<ProductDTO>>> = ApiClient.productService.getProducts(
                limit,
                page
            )

            /**
             * Handle response
             */
            handleApiResponse(response) { pagingDto ->
                PagingResponse(
                    meta = pagingDto.meta,
                    data = ProductMapper.fromDtoList(pagingDto.data)
                )
            }
        } catch (e: IOException) {
            Log.e(TAG, "Network error while loading products", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading products",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}