/**
 * @description Main repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-08-27
 * @modifies 2025-08-28
 * @modifies 2025-11-06
 * @modifies 2025-12-24
 * @version 1.0.5
 */

package com.example.e_commerce.Repository

import com.example.e_commerce.Model.BrandModel
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Result.NetworkResult
import retrofit2.HttpException
import java.io.IOException

class MainRepository(
    private val brandRepository: BrandRepository,
    private val productRepository: ProductRepository,
    private val bannerRepository: BannerRepository,
    private val cartRepository: CartRepository,
    private val wishlistRepository: WishlistRepository,
) {
    /**
     * @description Call api and handle result
     *
     * @param [Int] limit - limit of brands to load
     * @return [NetworkResult] result of brand list
     */
    suspend fun loadBrands(limit: Int): NetworkResult<List<BrandModel>> {
        return brandRepository.loadBrands(limit)
    }

    /**
     * @description Call api and handle result
     *
     * @return [NetworkResult] result of brand list
     */
    suspend fun loadPopular(): NetworkResult<PagingResponse<ProductModel>> {
        return productRepository.loadPopular(
            limit = 10,
            page = 1
        )
    }

    /**
     * @description Load static data for brands
     *
     * @return [NetworkResult] result of brand list
     */
    fun loadBanners(): NetworkResult<List<SliderModel>> {
        return bannerRepository.loadBanners()
    }

    /**
     * @description Call api and handle result
     *
     * @param [Int] productID - id of product to load
     * @return [NetworkResult] result of product detail
     */
    suspend fun loadProductDetail(productID: Int): NetworkResult<ProductDetailModel> {
        return productRepository.getProductDetailByProductID(productID)
    }

    /**
     * @description Call api and handle result
     *
     * @param [Int] [limit] - limit of carts to load
     * @param [Int] [page] - current page
     *
     * @return [NetworkResult] result of brand list
     */
    suspend fun loadCart(
        limit: Int,
        page: Int
    ): NetworkResult<PagingResponse<CartItemModel>> {
        return cartRepository.loadCart(
            limit = 10,
            page = 1
        )
    }

    /**
     * @description Call api and handle result
     *
     * @param [Int] [productID] - ID of product
     * @param [Int] [quantity] - quantity of product
     *
     * @return [NetworkResult]
     */
    suspend fun addProductToCart(productID: Int, quantity: Int): NetworkResult<String> {
        return cartRepository.addProductToCart(productID = productID, quantity = quantity)
    }

    /**
     * @description Load wishlist for each user
     *
     * @param [Int] [limit] - limit for paging
     * @param [Int] [page] - current page
     *
     * @return [NetworkResult] result of wishlist
     */
    suspend fun loadWishlist(limit: Int, page: Int): NetworkResult<PagingResponse<ProductModel>> {
        return wishlistRepository.loadWishlist(limit = limit, page = page)
    }

    /**
     * @description Add product to wishlist
     *
     * @param [Int] [productID] - ID of product to add to wishlist
     *
     * @return [NetworkResult] result of add product to wishlist
     */
    suspend fun addProductToWishlist(productID: Int): NetworkResult<Boolean> {
        return wishlistRepository.addProductToWishlist(productID = productID)
    }

    /**
     * @description Remove product to wishlist
     *
     * @param [Int] [productID] - ID of product to add to wishlist
     *
     * @return [NetworkResult] result of remove wishlist item
     */
    suspend fun removeWishlistItem(productID: Int): NetworkResult<Boolean> {
        return wishlistRepository.removeWishlistItem(productID = productID)
    }
}
