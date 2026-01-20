/**
 * @description Dto use for send request update quantity of cart detail
 * @author @nhuttan12
 * @since 2026-01-12
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs.Request

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class UpdateQuantityCartDetailRequestDto(
    val cartDetailID: Int,
    val quantity: Int
)
