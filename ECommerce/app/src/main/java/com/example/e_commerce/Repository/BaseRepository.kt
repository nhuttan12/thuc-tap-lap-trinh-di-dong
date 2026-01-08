/**
 * @description Base repository for handling api response
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.ApiError
import com.example.e_commerce.Provider.MoshiProvider
import com.example.e_commerce.Result.NetworkResult
import retrofit2.Response

abstract class BaseRepository {
    protected val moshi = MoshiProvider.moshi
    protected val errorAdapter = moshi.adapter(ApiError::class.java)

    protected inline fun <T, R> handleApiResponse(
        response: Response<ApiSucess<T>>,
        mapData: (T) -> R
    ): NetworkResult<R> {

        /**
         * If its status code is 200, return success
         */
        if (response.isSuccessful) {
            val body: ApiSucess<T> = response.body()
                ?: return NetworkResult.Error(
                    statusCode = response.code(),
                    message = "Unknown error"
                )

            return NetworkResult.Success(mapData(body.data))
        }

        /**
         * Handle error
         */
        val errorBody: String? = response.errorBody()?.string()

        val parsedError: ApiError? = try {
            errorBody?.let { errorAdapter.fromJson(it) }
        } catch (e: Exception) {
            null
        }

        return NetworkResult.Error(
            statusCode = parsedError?.statusCode ?: response.code(),
            message = parsedError
                ?.message
                ?.joinToString(", ")
                ?: "Unknown server error"
        )
    }
}