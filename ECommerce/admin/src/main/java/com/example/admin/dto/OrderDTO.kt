package com.example.admin.dto

import com.google.gson.annotations.SerializedName

data class OrderDTO(
        @SerializedName("id") val id: Int? = null,
        @SerializedName("userId") val userId: Int? = null,
        @SerializedName("username") val username: String? = null,
        @SerializedName("fullName") val fullName: String? = null,
        @SerializedName("email") val email: String? = null,
        @SerializedName("price") val price: Int = 0,
        @SerializedName("status") val status: String? = null,
        @SerializedName("createdAt") val createdAt: String? = null,
        @SerializedName("updatedAt") val updatedAt: String? = null,
        @SerializedName("items") val items: List<OrderItemDTO> = emptyList()
)

data class OrderItemDTO(
        @SerializedName("id") val id: Int? = null,
        @SerializedName("productId") val productId: Int? = null,
        @SerializedName("productName") val productName: String? = null,
        @SerializedName("quantity") val quantity: Int = 0,
        @SerializedName("price") val price: Int = 0,
        @SerializedName("total") val total: Int = 0
)

data class OrderFilterDTO(
        @SerializedName("status") val status: String? = null,
        @SerializedName("userId") val userId: Int? = null,
        @SerializedName("fromDate") val fromDate: String? = null,
        @SerializedName("toDate") val toDate: String? = null,
        @SerializedName("page") val page: Int = 1,
        @SerializedName("limit") val limit: Int = 20
)

data class OrderStatisticsDTO(
        @SerializedName("totalOrders") val totalOrders: Int = 0,
        @SerializedName("totalRevenue") val totalRevenue: Long = 0,
        @SerializedName("monthlyStats") val monthlyStats: List<MonthlyStat> = emptyList(),
        @SerializedName("statusStats") val statusStats: List<StatusStat> = emptyList()
)

data class MonthlyStat(
        @SerializedName("month") val month: String? = null,
        @SerializedName("orderCount") val orderCount: Int = 0,
        @SerializedName("revenue") val revenue: Long = 0
)

data class StatusStat(
        @SerializedName("status") val status: String? = null,
        @SerializedName("count") val count: Int = 0
)

data class UpdateOrderStatusRequest(
        @SerializedName("status") val status: String
)

data class CreateOrderItemRequest(
        @SerializedName("productId") val productId: Int,
        @SerializedName("quantity") val quantity: Int,
        @SerializedName("price") val price: Int
)

data class CreateOrderRequest(
        @SerializedName("userId") val userId: Int,
        @SerializedName("price") val price: Int,
        @SerializedName("status") val status: String,
        @SerializedName("items") val items: List<CreateOrderItemRequest>
)

data class UpdateOrderRequest(
        @SerializedName("userId") val userId: Int? = null,
        @SerializedName("price") val price: Int? = null,
        @SerializedName("status") val status: String? = null,
        @SerializedName("items") val items: List<CreateOrderItemRequest>? = null
)

data class OrderListResponse(
        @SerializedName("orders") val orders: List<OrderDTO>,
        @SerializedName("total") val total: Int
)