/**
 * @description Product class for getting data from api
 * @author @nhuttan12
 * @since 2025-12-24
 * @version 1.0.0
 */

package com.example.e_commerce.DTOs

data class ProductDTO(
    val id: Int,
    val name: String,
    val price: Int,
    val description: String,
    val discount: Int,
    val imageUrl: List<String>,
    val size: List<String>,
    val color: List<String>,
    val rating: Double,
    val status: String,
    val createdAt: String,
    val updatedAt: String,
)