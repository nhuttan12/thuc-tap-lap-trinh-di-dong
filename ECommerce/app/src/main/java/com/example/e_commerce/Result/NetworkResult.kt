/**
 * @description Network result for handling api response
 * @author @nhuttan12
 * @since 2025-12-17
 * @version 1.0.0
 */

package com.example.e_commerce.Result

sealed class NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>()
    data class Error(
        val statusCode: Int,
        val message: String
    ) : NetworkResult<Nothing>()
    object Loading : NetworkResult<Nothing>()
}