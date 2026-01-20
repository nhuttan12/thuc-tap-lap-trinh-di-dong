package com.example.admin.model

data class OrderModel(
        val id: Int = 0,
        val userId: Int? = null,
        val username: String? = null,
        val fullName: String? = null,
        val email: String? = null,
        val price: Int = 0,
        val formattedPrice: String = "",
        val status: String = "ACTIVE",
        val statusText: String = "",
        val statusColor: Int = android.R.color.holo_green_dark,
        val createdAt: String = "",
        val formattedDate: String = "",
        val updatedAt: String = "",
        val items: List<OrderItemModel> = emptyList(),
        val itemCount: Int = 0
)

data class OrderItemModel(
        val id: Int = 0,
        val productId: Int? = null,
        val productName: String = "",
        val quantity: Int = 0,
        val price: Int = 0,
        val formattedPrice: String = "",
        val total: Int = 0,
        val formattedTotal: String = ""
)

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