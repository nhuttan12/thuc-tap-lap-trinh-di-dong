package com.example.admin.mapper

import com.example.admin.R
import com.example.admin.dto.*
import com.example.admin.helper.FormatHelper
import com.example.admin.model.*
import java.text.SimpleDateFormat
import java.util.*

object OrderMapper {

    fun toOrderModel(dto: OrderDTO): OrderModel {
        // Default to PENDING thay vì ACTIVE
        val status = dto.status?.uppercase() ?: "PENDING"

        return OrderModel(
                id = dto.id ?: 0,
                userId = dto.userId,
                username = dto.username ?: "",
                fullName = dto.fullName ?: "",
                email = dto.email ?: "",
                price = dto.price,
                formattedPrice = FormatHelper.formatCurrency(dto.price),
                status = status, // Dùng status đã được normalize
                createdAt = dto.createdAt ?: "",
                formattedDate = formatDate(dto.createdAt),
                updatedAt = dto.updatedAt ?: "",
                items = dto.items.map { toOrderItemModel(it) },
                itemCount = dto.items.size
        )
    }

    fun toOrderItemModel(dto: OrderItemDTO): OrderItemModel {
        return OrderItemModel(
                id = dto.id ?: 0,
                productId = dto.productId,
                productName = dto.productName ?: "Sản phẩm #${dto.productId}",
                quantity = dto.quantity,
                price = dto.price,
                formattedPrice = FormatHelper.formatCurrency(dto.price),
                total = dto.total,
                formattedTotal = FormatHelper.formatCurrency(dto.total)
        )
    }

    fun toStatisticsModel(dto: OrderStatisticsDTO): OrderStatisticsModel {
        return OrderStatisticsModel(
                totalOrders = dto.totalOrders,
                totalRevenue = dto.totalRevenue,
                formattedRevenue = FormatHelper.formatCurrency(dto.totalRevenue.toDouble()),
                monthlyStats = dto.monthlyStats.map { toMonthlyStatModel(it) },
                statusStats = dto.statusStats.map { toStatusStatModel(it) }
        )
    }

    private fun toMonthlyStatModel(dto: MonthlyStat): MonthlyStatModel {
        return MonthlyStatModel(
                month = dto.month ?: "",
                orderCount = dto.orderCount,
                revenue = dto.revenue,
                formattedRevenue = FormatHelper.formatCurrency(dto.revenue.toDouble())
        )
    }

    private fun toStatusStatModel(dto: StatusStat): StatusStatModel {
        // Sử dụng status mapping mới
        val status = dto.status?.uppercase() ?: ""
        val (statusText, statusColor) = getStatusInfo(status)

        return StatusStatModel(
                status = status,
                count = dto.count,
                statusText = statusText,
                statusColor = statusColor
        )
    }

    private fun getStatusInfo(status: String): Pair<String, Int> {
        return when (status.uppercase()) {
            "PENDING" -> Pair("Chờ xử lý", R.color.status_pending)
            "CONFIRMED" -> Pair("Đã xác nhận", R.color.status_confirmed)
            "PROCESSING" -> Pair("Đang xử lý", R.color.status_processing)
            "COMPLETED" -> Pair("Đã hoàn thành", R.color.status_completed)
            "CANCELED" -> Pair("Đã hủy", R.color.status_canceled) // 1 chữ L
            "ON_HOLD" -> Pair("Tạm hoãn", R.color.status_on_hold)

            // Giữ các status cũ để backward compatibility (tùy chọn)
            "ACTIVE" -> Pair("Đang xử lý", R.color.status_processing) // Map ACTIVE to PROCESSING
            "INACTIVE" -> Pair("Đã hủy", R.color.status_canceled) // Map INACTIVE to CANCELED
            "DELETED" -> Pair("Đã xóa", R.color.status_on_hold) // Map DELETED to ON_HOLD
            "SHIPPING" -> Pair("Đang giao", R.color.status_processing) // Map SHIPPING to PROCESSING

            else -> Pair(status, R.color.status_default)
        }
    }

    private fun formatDate(dateString: String?): String {
        if (dateString.isNullOrEmpty()) return ""

        return try {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            inputFormat.timeZone = TimeZone.getTimeZone("UTC")
            val outputFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
            val date = inputFormat.parse(dateString)
            outputFormat.format(date ?: Date())
        } catch (e: Exception) {
            // Thử format khác nếu format đầu tiên fail
            try {
                val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
                val outputFormat = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
                val date = inputFormat.parse(dateString)
                outputFormat.format(date ?: Date())
            } catch (e2: Exception) {
                dateString
            }
        }
    }

    fun toOrderList(models: List<OrderModel>): List<OrderDTO> {
        return models.map { toOrderDTO(it) }
    }

    private fun toOrderDTO(model: OrderModel): OrderDTO {
        return OrderDTO(
                id = model.id,
                userId = model.userId,
                username = model.username,
                fullName = model.fullName,
                email = model.email,
                price = model.price,
                status = model.status,
                createdAt = model.createdAt,
                updatedAt = model.updatedAt,
                items = model.items.map { toOrderItemDTO(it) }
        )
    }

    private fun toOrderItemDTO(model: OrderItemModel): OrderItemDTO {
        return OrderItemDTO(
                id = model.id,
                productId = model.productId,
                productName = model.productName,
                quantity = model.quantity,
                price = model.price,
                total = model.total
        )
    }

    // Helper để validate status hợp lệ
    fun isValidStatus(status: String): Boolean {
        val validStatuses = listOf(
                "PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELED", "ON_HOLD",
                // Các status cũ để backward compatibility
                "ACTIVE", "INACTIVE", "DELETED", "SHIPPING"
        )
        return validStatuses.contains(status.uppercase())
    }

    // Normalize status từ các giá trị cũ sang mới
    fun normalizeStatus(status: String): String {
        return when (status.uppercase()) {
            "ACTIVE" -> "PROCESSING"
            "INACTIVE" -> "CANCELED"
            "DELETED" -> "ON_HOLD"
            "SHIPPING" -> "PROCESSING"
            "PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELED", "ON_HOLD" -> status.uppercase()
            else -> "PENDING" // Default
        }
    }
}