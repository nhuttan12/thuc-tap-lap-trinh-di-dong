/**
 * @description Wishlist repository for call service and handle mapping
 * @author @nhuttan12
 * @since 2026-01-11
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.DTOs.Request.AddProductToWishlistRequestDto
import com.example.e_commerce.DTOs.Request.RemoveProductFromWishlistDto
import com.example.e_commerce.DTOs.Response.PagingResponse
import com.example.e_commerce.DTOs.Response.ProductInWishlistResponseDto
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Mappers.ProductMapper
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class WishlistRepository(
    private val tinyDB: TinyDB
) : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "WishlistRepository"

    /**
     * @description Load wishlist for each user
     *
     * @param [Int] [limit] - limit for paging
     * @param [Int] [page] - current page
     *
     * @return [NetworkResult] result of wishlist
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @author @nhuttan12
     * @since 2026-01-11
     * @version 1.0.0
     */
    suspend fun loadWishlist(
        limit: Int,
        page: Int
    ): NetworkResult<PagingResponse<ProductModel>> {
        return try {
            /**
             * Get token
             */
            val token: String = tinyDB.getValidToken()!!

            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<PagingResponse<ProductInWishlistResponseDto>>> =
                ApiClient.wishlistService.getAllProductInWishlist(
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
                    data = ProductMapper.fromProductInWishlistResponseDtoList(pagingDto.data)
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
     * @description Add product to wishlist
     *
     * @param [Int] [productID] - ID of product to add to wishlist
     *
     * @return [NetworkResult] result of add product to wishlist
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @author @nhuttan12
     * @modifies 2026-01-12
     * @version 1.0.1
     */
    suspend fun addProductToWishlist(productID: Int): NetworkResult<Boolean> {
        return try {
            /**
             * Get token
             */
            val token: String = tinyDB.getValidToken()!!

            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<Boolean>> =
                ApiClient.wishlistService.addProductToWishlist(
                    token = "Bearer $token",
                    request = AddProductToWishlistRequestDto(productID)
                );
            Log.d(TAG, "Add product to wishlist response: ${response.body()?.data}")

            /**
             * Handle response
             */
            handleApiResponse(response) { it }
        } catch (e: IOException) {
            Log.e(TAG, "Network error while adding product to wishlist, productID=$productID", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while adding product to wishlist, productID=$productID",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }

    /**
     * @description Remove product to wishlist
     *
     * @param [Int] [productID] - ID of product to add to wishlist
     *
     * @return [NetworkResult] result of remove wishlist item
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @author @nhuttan12
     * @since 2026-01-11
     * @version 1.0.0
     */
    suspend fun removeWishlistItem(productID: Int): NetworkResult<Boolean> {
        return try {
            /**
             * Get token
             */
            val token: String = tinyDB.getValidToken()!!

            /**
             * Call api to load brands
             * Handle result
             */
            val response: Response<ApiSucess<Boolean>> =
                ApiClient.wishlistService.removeWishlistItem(
                    token = "Bearer $token",
                    request = RemoveProductFromWishlistDto(productID = productID)
                );
            Log.d(TAG, "Remove product from wishlist response: ${response.body()?.data}")

            /**
             * Handle response
             */
            handleApiResponse(response) { it }
        } catch (e: IOException) {
            Log.e(TAG, "Network error while loading brands, productID=$productID", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading brands, productID=$productID",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}