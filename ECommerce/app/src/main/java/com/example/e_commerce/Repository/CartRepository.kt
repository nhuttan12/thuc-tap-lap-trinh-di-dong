package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.DTOs.Request.AddProductToCartRequestDto
import com.example.e_commerce.DTOs.Response.CartDetailResponseDto
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Mappers.CartMapper
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class CartRepository(
    private val tinyDB: TinyDB
) : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "CartRepository"

    /**
     * @description Call api and handle result
     *
     * @param [Int] [limit] - limit of carts to load
     * @param [Int] [page] - current page
     *
     * @return [NetworkResult]
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2025-12-24
     * @version 1.0.0
     */
    suspend fun loadCart(
        limit: Int,
        page: Int
    ): NetworkResult<PagingResponse<CartItemModel>> {
        return try {
            /**
             * Get token
             */
            val token: String = tinyDB.getToken()!!

            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<PagingResponse<CartDetailResponseDto>>> =
                ApiClient.cartService.getUserCart(
                    token = "Bearer $token",
                    limit = limit,
                    page = page
                );
            response.body()?.data?.data?.forEachIndexed { index, brand ->
                Log.d(TAG, "Cart item $index: ${brand}")
            }

            /**
             * Handle response
             */
            handleApiResponse(response) { pagingDto ->
                PagingResponse(
                    meta = pagingDto.meta,
                    data = CartMapper.fromCartDetailResponseDtoList(pagingDto.data)
                )
            }
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

    /**
     * @description Call api and handle result
     *
     * @param [Int] [productID] - ID of product
     * @param [Int] [quantity] - quantity of product
     *
     * @return [NetworkResult]
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2025-12-24
     * @version 1.0.0
     */
    suspend fun addProductToCart(productID: Int, quantity: Int): NetworkResult<String> {
        return try {
            /**
             * Get token
             */
            val token: String = tinyDB.getToken()!!

            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<String>> =
                ApiClient.cartService.addProductToCart(
                    token = "Bearer $token",
                    AddProductToCartRequestDto(productID = productID, quantity = quantity)
                );

            Log.d(TAG, "Add product to card ${response.body()?.data}")

            handleApiResponse(response) { it }
        } catch (e: IOException) {
            Log.e(
                TAG,
                "Network error while loading brands, productID=$productID , quantity=$quantity",
                e
            )
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading brands, productID=$productID , quantity=$quantity",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}