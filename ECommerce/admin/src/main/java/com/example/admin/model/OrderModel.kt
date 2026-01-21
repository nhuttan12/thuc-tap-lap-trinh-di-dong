package com.example.admin.model

import android.content.Context
import androidx.annotation.ColorRes
import androidx.core.content.ContextCompat
import com.example.admin.R

data class OrderModel(
        val id: Int = 0,
        val userId: Int? = null,
        val username: String? = null,
        val fullName: String? = null,
        val email: String? = null,
        val price: Int = 0,
        val formattedPrice: String = "",
        val status: String = "",
        val createdAt: String = "",
        val formattedDate: String = "",
        val updatedAt: String = "",
        val items: List<OrderItemModel> = emptyList(),
        val itemCount: Int = 0,
) {
    val statusText: String
        get() = when (status.uppercase()) {
            "PENDING" -> "Chờ xử lý"
            "CONFIRMED" -> "Đã xác nhận"
            "PROCESSING" -> "Đang xử lý"
            "COMPLETED" -> "Đã hoàn thành"
            "CANCELED" -> "Đã hủy"
            "ON_HOLD" -> "Tạm hoãn"
            // Backward compatibility
            "ACTIVE" -> "Đang xử lý"
            "INACTIVE" -> "Đã hủy"
            "DELETED" -> "Đã xóa"
            else -> status
        }

    // Sửa: Xóa @ColorRes và trả về Int resource ID
    val statusColorResId: Int
        get() = when (status.uppercase()) {
            "PENDING" -> R.color.status_pending
            "CONFIRMED" -> R.color.status_confirmed
            "PROCESSING" -> R.color.status_processing
            "COMPLETED" -> R.color.status_completed
            "CANCELED" -> R.color.status_canceled
            "ON_HOLD" -> R.color.status_on_hold
            // Backward compatibility
            "ACTIVE" -> R.color.status_processing
            "INACTIVE" -> R.color.status_canceled
            "DELETED" -> R.color.status_on_hold
            else -> R.color.status_default
        }

    val statusBackground: Int
        get() = when (status.uppercase()) {
            "PENDING" -> R.drawable.bg_status_pending
            "CONFIRMED" -> R.drawable.bg_status_confirmed
            "PROCESSING" -> R.drawable.bg_status_processing
            "COMPLETED" -> R.drawable.bg_status_completed
            "CANCELED" -> R.drawable.bg_status_canceled
            "ON_HOLD" -> R.drawable.bg_status_on_hold
            // Backward compatibility
            "ACTIVE" -> R.drawable.bg_status_processing
            "INACTIVE" -> R.drawable.bg_status_canceled
            "DELETED" -> R.drawable.bg_status_on_hold
            else -> R.drawable.bg_status_default
        }

    val isEditable: Boolean
        get() = status.uppercase() in listOf("PENDING", "CONFIRMED", "PROCESSING", "ON_HOLD")

    val isCancelable: Boolean
        get() = status.uppercase() in listOf("PENDING", "CONFIRMED", "PROCESSING", "ON_HOLD")

    val totalQuantity: Int
        get() = items.sumOf { it.quantity }

    // Thêm method helper để lấy màu dưới dạng Int (color value)
    fun getStatusColor(context: Context): Int {
        return ContextCompat.getColor(context, statusColorResId)
    }
}
data class OrderItemModel(
        val id: Int = 0,
        val productId: Int? = null,
        val productName: String = "",
        val quantity: Int = 0,
        val price: Int = 0,
        val formattedPrice: String = "",
        val total: Int = 0,
        val formattedTotal: String = ""
) {
    // Helper methods cho OrderItemModel
    fun getDisplayName(): String {
        return if (productName.isNotEmpty()) {
            productName
        } else {
            "Sản phẩm #${productId ?: id}"
        }
    }
}

data class OrderStatisticsModel(
        val totalOrders: Int = 0,
        val totalRevenue: Long = 0,
        val formattedRevenue: String = "",
        val monthlyStats: List<MonthlyStatModel> = emptyList(),
        val statusStats: List<StatusStatModel> = emptyList()
)

data class MonthlyStatModel(
        val month: String = "",
        val orderCount: Int = 0,
        val revenue: Long = 0,
        val formattedRevenue: String = ""
)

data class StatusStatModel(
        val status: String = "",
        val count: Int = 0,
        val statusText: String = "",
        val statusColor: Int = android.R.color.holo_green_dark
)