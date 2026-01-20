/**
 * @description Product repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.DTOs.Response.PagingResponse
import com.example.e_commerce.DTOs.Response.ProductDTO
import com.example.e_commerce.DTOs.Response.ProductDetailDTO
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.Mappers.ProductMapper
import com.example.e_commerce.Model.ApiSucess
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Result.NetworkResult
import com.example.e_commerce.Service.ApiClient
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException
import kotlin.collections.forEachIndexed

class ProductRepository(
    private val tinyDB: TinyDB
) : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "BrandRepository"

    /**
     * @description Call api and handle result
     *
     * @param [Int] [limit] - limit for paging
     * @param [Int] [page] - current page
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
    suspend fun loadProductList(
        limit: Int,
        page: Int
    ): NetworkResult<PagingResponse<ProductModel>> {
        return try {
            /**
             * Get token
             */
            val token: String? = tinyDB.getValidToken()

            val bearerToken: String? = token?.let { "Bearer $it" }

            /**
             * Call api to get products paging
             * Handle result
             */
            val response: Response<ApiSucess<PagingResponse<ProductDTO>>> =
                ApiClient.productService.getProducts(
                    limit = limit,
                    page = page,
                    token = bearerToken
                )
            response.body()?.data?.data?.forEachIndexed { index, brand ->
                Log.d(TAG, "Product $index: ${brand}")
            }

            /**
             * Handle response
             */
            handleApiResponse(response) { pagingDto ->
                PagingResponse(
                    meta = pagingDto.meta,
                    data = ProductMapper.fromProductDTOList(pagingDto.data)
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

    /**
     * @description Call api and handle result
     *
     * @return [NetworkResult] result of brand list
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2026-01-07
     * @author @nhuttan12
     * @version 1.0.0
     */
    suspend fun getProductDetailByProductID(productID: Int): NetworkResult<ProductDetailModel> {
        return try {
            /**
             * Call api to load product detail
             * Handle result
             */
            val response: Response<ApiSucess<ProductDetailDTO>> =
                ApiClient.productService.getProductDetailByProductID(
                    productID,
                )
            response.body()?.data?.let { it ->
                Log.d(TAG, "Get product detail by productID: $it")
            }

            /**
             * Handle response
             */
            handleApiResponse(response) { productDetail ->
                ProductMapper.fromProductDetailDTO(productDetail)
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

    /**
     * @description Call api to get product list by name and handle result
     *
     * @param [Int] [limit] - limit for paging
     * @param [Int] [page] - current page
     * @param [String] [productName] - product name
     *
     * @return [NetworkResult] result of brand list
     *
     * @throws [IOException] if network error occurs
     * @throws [HttpException] if server error occurs
     *
     * @since 2026-01-16
     * @author @nhuttan12
     * @version 1.0.0
     */
    suspend fun loadProductListByName(
        limit: Int,
        page: Int,
        productName: String
    ): NetworkResult<PagingResponse<ProductModel>> {
        return try {
            /**
             * Get token
             */
            val token: String? = tinyDB.getValidToken()

            val bearerToken: String? = token?.let { "Bearer $it" }

            /**
             * Call api to get products paging
             * Handle result
             */
            val response: Response<ApiSucess<PagingResponse<ProductDTO>>> =
                ApiClient.productService.getProductsByName(
                    limit = limit,
                    page = page,
                    productName = productName,
                    token = bearerToken
                )
            response.body()?.data?.data?.forEachIndexed { index, brand ->
                Log.d(TAG, "Product $index: ${brand}")
            }

            /**
             * Handle response
             */
            handleApiResponse(response) { pagingDto ->
                PagingResponse(
                    meta = pagingDto.meta,
                    data = ProductMapper.fromProductDTOList(pagingDto.data)
                )
            }
        } catch (e: IOException) {
            Log.e(TAG, "Network error while loading products by name", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading products by name",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}