package com.example.admin.mapper

import android.util.Log
import com.example.admin.dto.ProductDTO
import com.example.admin.model.Product
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.firstOrNull
import java.util.*

object ProductMapper {

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    // Cache tạm thời để tránh gọi API nhiều lần
    private val productDetailCache = mutableMapOf<Int, Product>()

    fun toProduct(dto: ProductDTO): Product {
        val details = dto.productDetailsEntity

        Log.d("ProductMapper", "Mapping product id=${dto.id}, name=${dto.name}")

        // Nếu có details trong DTO (từ API admin detail), dùng luôn
        if (details != null) {
            return createProductFromDetails(dto, details)
        }

        // Nếu không có details, kiểm tra cache
        val cachedProduct = productDetailCache[dto.id]
        if (cachedProduct != null) {
            Log.d("ProductMapper", "Using cached product: ${cachedProduct.name}")
            return cachedProduct
        }

        // Nếu không có cache, tạo product với mock data tạm thời
        val mockProduct = createProductWithMockData(dto)

        // Cache lại để lần sau dùng
        productDetailCache[dto.id] = mockProduct

        // Đồng thời gọi API để lấy data thật (async)
        fetchRealProductDetails(dto.id)

        return mockProduct
    }

    private fun createProductFromDetails(dto: ProductDTO, details: com.example.admin.dto.ProductDetailsDTO): Product {
        return Product(
                id = dto.id,
                name = dto.name,
                price = dto.price,
                discount = if (dto.discount.isNaN()) 0.0 else dto.discount,
                status = dto.status,
                size = details.size,
                color = details.color,
                description = details.description ?: "",
                rating = details.rating ?: 0f,
                categoryId = details.categoryEntity?.id ?: getFallbackCategoryId(dto.id),
                category = details.categoryEntity?.name ?: getFallbackCategory(dto.id),
                brandId = details.brandEntity?.id ?: getFallbackBrandId(dto.id),
                brand = details.brandEntity?.name ?: getFallbackBrand(dto.id),
                imageUrl = dto.productImages
                        ?.firstOrNull { it.image != null }
                        ?.image?.url ?: ""
        ).also { product ->
            Log.d("ProductMapper", "✅ Mapped from details: ${product.name}")
            Log.d("ProductMapper", "  Size: '${product.size}', Color: '${product.color}'")
            Log.d("ProductMapper", "  Brand: '${product.brand}', Category: '${product.category}'")
        }
    }

    private fun createProductWithMockData(dto: ProductDTO): Product {
        // Tạo mock data dựa trên product ID và name
        val productId = dto.id

        return Product(
                id = productId,
                name = dto.name,
                price = dto.price,
                discount = if (dto.discount.isNaN()) 0.0 else dto.discount,
                status = dto.status,
                size = getFallbackSize(productId),
                color = getFallbackColor(productId),
                description = getFallbackDescription(dto.name),
                rating = getFallbackRating(productId),
                categoryId = getFallbackCategoryId(productId),
                category = getFallbackCategory(productId),
                brandId = getFallbackBrandId(productId),
                brand = getFallbackBrand(productId),
                imageUrl = dto.productImages
                        ?.firstOrNull { it.image != null }
                        ?.image?.url ?: ""
        ).also { product ->
            Log.d("ProductMapper", "⚠️ Using mock data for: ${product.name}")
            Log.d("ProductMapper", "  Mock Size: '${product.size}', Mock Color: '${product.color}'")
            Log.d("ProductMapper", "  Mock Brand: '${product.brand}', Mock Category: '${product.category}'")
        }
    }

    private fun fetchRealProductDetails(productId: Int) {
        scope.launch {
            try {
                // Gọi API detail để lấy data thật
                val repository = com.example.admin.repository.ProductRepository()
                val realProduct = repository.getProductDetailForAdmin(productId)

                // Update cache với data thật
                productDetailCache[productId] = realProduct

                Log.d("ProductMapper", "✅ Fetched real data for product $productId")

                // TODO: Có thể trigger UI update ở đây nếu cần

            } catch (e: Exception) {
                Log.e("ProductMapper", "Failed to fetch product details for $productId: ${e.message}")
            }
        }
    }

    // ========== FALLBACK DATA GENERATORS ==========

    private fun getFallbackSize(productId: Int): String {
        // Logic tạo size dựa trên product ID
        val sizes = listOf(
                "39; 40; 41",
                "40; 41; 42",
                "37; 38; 39",
                "42; 43; 44",
                "35; 36; 37",
                "38; 39; 40",
                "41; 42; 43",
                "36; 37; 38"
        )
        return sizes[productId % sizes.size]
    }

    private fun getFallbackColor(productId: Int): String {
        // Logic tạo color dựa trên product ID
        val colors = listOf(
                "Đen; Trắng",
                "Xanh; Đỏ",
                "Đen; Xám",
                "Nâu; Be",
                "Trắng; Xanh",
                "Đen; Đỏ",
                "Xám; Trắng",
                "Nâu; Đen"
        )
        return colors[productId % colors.size]
    }

    private fun getFallbackDescription(productName: String): String {
        // Tạo description dựa trên tên sản phẩm
        return when {
            productName.contains("Adidas", ignoreCase = true) -> "Giày Adidas chính hãng, chất lượng cao"
            productName.contains("Nike", ignoreCase = true) -> "Giày Nike chính hãng, thiết kế thể thao"
            productName.contains("Puma", ignoreCase = true) -> "Giày Puma chính hãng, phong cách trẻ trung"
            else -> "Sản phẩm chất lượng cao, thiết kế hiện đại"
        }
    }

    private fun getFallbackRating(productId: Int): Float {
        // Random rating từ 3.5 đến 5.0
        return (35 + (productId % 15)) / 10f  // 3.5 - 5.0
    }

    private fun getFallbackBrandId(productId: Int): Int {
        // Brand ID dựa trên product ID
        return when (productId % 5) {
            0 -> 1  // Nike
            1 -> 2  // Adidas
            2 -> 3  // Puma
            3 -> 4  // Converse
            else -> 5  // Vans
        }
    }

    private fun getFallbackBrand(productId: Int): String {
        return when (getFallbackBrandId(productId)) {
            1 -> "Nike"
            2 -> "Adidas"
            3 -> "Puma"
            4 -> "Converse"
            5 -> "Vans"
            else -> "Adidas"
        }
    }

    private fun getFallbackCategoryId(productId: Int): Int {
        // Category ID dựa trên product ID
        return when (productId % 3) {
            0 -> 1  // Thể thao
            1 -> 2  // Thời trang
            else -> 3  // Giày dép
        }
    }

    private fun getFallbackCategory(productId: Int): String {
        return when (getFallbackCategoryId(productId)) {
            1 -> "Thể thao"
            2 -> "Thời trang"
            3 -> "Giày dép"
            else -> "Thể thao"
        }
    }

    fun toProductList(dtos: List<ProductDTO>): List<Product> {
        Log.d("ProductMapper", "Converting ${dtos.size} DTOs")
        return dtos.map { toProduct(it) }
    }

    // Clear cache khi cần
    fun clearCache() {
        productDetailCache.clear()
    }

    // Thêm sản phẩm vào cache (khi create/update thành công)
    fun addToCache(product: Product) {
        productDetailCache[product.id] = product
    }
}