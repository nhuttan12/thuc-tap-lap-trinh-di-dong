/**
 * @description Banner repository for connecting to View Model
 * @author @nhuttan12
 * @since 2025-12-24
 * @modifies 2025-12-26
 * @version 1.0.0
 */

package com.example.e_commerce.Repository

import android.util.Log
import com.example.e_commerce.Model.SliderModel
import com.example.e_commerce.Result.NetworkResult
import retrofit2.HttpException
import java.io.IOException

class BannerRepository : BaseRepository() {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "BrandRepository"

    /**
     * @description Load static data for brands
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
    fun loadBanners(): NetworkResult<MutableList<SliderModel>> {
        return try {
            val bannerList = mutableListOf<SliderModel>(
                SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner2_acujbo.png"),
                SliderModel(url = "https://res.cloudinary.com/dt3yrf9sx/image/upload/v1756053804/banner1_atxhnk.png"),
            )
            NetworkResult.Success(bannerList)
        } catch (e: IOException) {
            Log.e(TAG, "Network error while loading banners", e)
            NetworkResult.Error(503, "Network error")
        } catch (e: HttpException) {
            Log.e(
                TAG,
                "HTTP ${e.code()} while loading banners",
                e
            )
            NetworkResult.Error(e.code(), "Server error")
        }
    }
}