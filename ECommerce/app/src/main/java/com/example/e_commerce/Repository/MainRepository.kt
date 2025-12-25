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
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Result.NetworkResult
import retrofit2.HttpException
import java.io.IOException

class MainRepository(
    private val brandRepository: BrandRepository,
    private val productRepository: ProductRepository,
    private val bannerRepository: BannerRepository
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
    suspend fun loadPopular(): NetworkResult<List<ProductModel>> {
        return productRepository.loadPopular()
    }

    /**
     * @description Load static data for brands
     *
     * @return [NetworkResult] result of brand list
     */
    fun loadBanners(): NetworkResult<List<SliderModel>> {
        return bannerRepository.loadBanners()
    }
}
