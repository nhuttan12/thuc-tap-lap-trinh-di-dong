/**
 * @description Main repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-08-27
 * @modifies 2025-08-28
 * @modifies 2025-11-06
 * @modifies 2025-12-06
 * @modifies 2025-12-22
 * @version 1.0.4
 */

package com.example.e_commerce.Repository

import android.net.Network
import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.ErrorResponse
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.ApiResponse
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Provider.MoshiProvider
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class MainRepository {
    private val moshi = MoshiProvider.moshi
    private val errorAdapter=moshi.adapter(ErrorResponse::class.java)

    private inline fun <T, R> handleApiResponse(
        response: Response<ApiResponse<T>>,
        mapData: (T) -> R
    ): NetworkResult<R> {

        /**
         * If its status code is 200, return success
         * Else return error
         */
        return if (response.isSuccessful) {
            val body: ApiResponse<T> = response.body()
                ?: return NetworkResult.Error(
                    statusCode = response.code(),
                    message = "Unknown error"
                )

            NetworkResult.Success(mapData(body.data))
        } else {
            val errorJson: String? = response.errorBody()?.string()
            val error: ErrorResponse? = errorJson?.let { errorAdapter.fromJson(it) }

            NetworkResult.Error(
                statusCode = error?.statusCode ?: response.code(),
                message = error?.message ?: "Unknown error"
            )
        }
    }

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
            NetworkResult.Error(503, "Network error")
        }
        catch (e: HttpException) {
            NetworkResult.Error(e.code(), "Server error")
        }
    }

    fun loadBanners(): NetworkResult<MutableList<SliderModel>> {
        return try {
            val bannerList = mutableListOf<SliderModel>(
                SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner2_acujbo.png"),
                SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner1_atxhnk.png"),
            )
            NetworkResult.Success(bannerList)
        } catch (e: IOException) {
            NetworkResult.Error(503, "Network error")
        }
        catch (e: HttpException) {
            NetworkResult.Error(e.code(), "Server error")
        }
    }

    suspend fun loadPopular(): NetworkResult<List<ProductModel>> {
        return try {
            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiResponse<List<ProductModel>>> = ApiClient.productService.getProducts()

            /**
             * Handle response
             */
            handleApiResponse(response) { it }
        } catch (e: IOException) {
            NetworkResult.Error(503, "Network error")
        }
        catch (e: HttpException) {
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}