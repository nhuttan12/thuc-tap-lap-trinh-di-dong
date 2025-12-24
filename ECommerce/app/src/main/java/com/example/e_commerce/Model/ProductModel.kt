/**
 * @description Product model for fetching api from backend
 * @author @nhuttan12
 * @since 2025-11-06
 * @modifies 2025-11-06
 * @version 1.0.1
 */

package com.example.e_commerce.Model

import com.squareup.moshi.JsonClass
import java.io.Serializable

@JsonClass(generateAdapter = true)
data class ProductModel(
    var title: String = "",
    var description: String = "",
    var picUrl: ArrayList<String> = ArrayList(),
    var size: ArrayList<String> = ArrayList(),
    var color: ArrayList<String> = ArrayList(),
    var price: Double = 0.0,
    var oldPrice: Double = 0.0,
    var rating: Double = 0.0,
    var numberInCart: Int = 1
) : Serializable
