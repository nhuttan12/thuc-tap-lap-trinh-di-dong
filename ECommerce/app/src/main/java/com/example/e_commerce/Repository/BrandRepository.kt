/**
 * @description Brand repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class BrandRepository() : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "BrandRepository"

    /**
     * @description Call api and handle result
     *
     * @param [Int] limit - limit of brands to load
     * @return [NetworkResult] result of brand list
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2025-12-24
     * @version 1.0.0
     */
    suspend fun loadBrands(limit: Int): NetworkResult<List<BrandModel>> {
        return try {
            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<List<BrandModel>>> =
                ApiClient.brandService.getBrandsWithLimitation(limit)
            response.body()?.data?.forEachIndexed { index, brand ->
                Log.d(TAG, "Brand $index: ${brand}")
            }

            /**
             * Handle response
             */
            handleApiResponse(response) { it }
        } catch (e: IOException) {
            Log.e(TAG, "Network error while loading brands, limit=$limit", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading brands, limit=$limit",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}