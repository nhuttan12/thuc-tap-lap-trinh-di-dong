/**
 * @description Base repository for handling api response
 * @author @nhuttan12
 * @since 2025-12-24
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import com.example.e_commerce.Model.ApiResponse
import com.example.e_commerce.Model.ErrorResponse
import com.example.e_commerce.Provider.MoshiProvider
import com.example.e_commerce.Result.NetworkResult
import retrofit2.Response

abstract class BaseRepository {
    protected val moshi = MoshiProvider.moshi
    protected val errorAdapter = moshi.adapter(ErrorResponse::class.java)

    protected inline fun <T, R> handleApiResponse(
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
}