/**
 * @description Product model for fetching api from backend
 * @author @nhuttan12
 * @since 2026-01-07
 * @version 1.0.0
 */

package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass
import java.io.Serializable

@JsonClass(generateAdapter = true)
data class ProductDetailModel(
    var title: String = "",
    var description: ArrayList<String> = ArrayList(),
    var picUrl: ArrayList<String> = ArrayList(),
    var size: ArrayList<String> = ArrayList(),
    var color: ArrayList<String> = ArrayList(),
    var price: Double = 0.0,
    var oldPrice: Double = 0.0,
    var rating: Double = 0.0,
    var numberInCart: Int = 1
) : Serializable
