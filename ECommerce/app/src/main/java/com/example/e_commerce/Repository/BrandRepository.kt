/**
 * @description Brand repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Model.ApiResponse
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class BrandRepository() : BaseRepository() {
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
            val response: Response<ApiResponse<List<BrandModel>>> = ApiClient.brandService.getBrandsWithLimitation(limit)

            /**
             * Handle response
             */
            handleApiResponse(response) { it }
        } catch (e: IOException) {
            e.printStackTrace()
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}