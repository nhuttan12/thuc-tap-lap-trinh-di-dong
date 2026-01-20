package com.example.admin.repository

import android.util.Log
import com.example.admin.dto.*
import com.example.admin.helper.NetworkHelper
import com.example.admin.mapper.OrderMapper
import com.example.admin.model.OrderModel
import com.example.admin.model.OrderStatisticsModel
import com.example.admin.service.ApiService
import com.example.admin.service.OrderApiService
import retrofit2.HttpException

class OrderRepository(
        private val apiService: OrderApiService = ApiService.orderService
) {

    suspend fun getOrders(
            status: String? = null,
            userId: Int? = null,
            fromDate: String? = null,
            toDate: String? = null,
            page: Int = 1,
            limit: Int = 20
    ): List<OrderModel> {
        try {
            NetworkHelper.logRequest("admin/orders", "GET")

            val response = apiService.getOrders(
                    status = status,
                    userId = userId,
                    fromDate = fromDate,
                    toDate = toDate,
                    page = page,
                    limit = limit
            )

            if (response.isSuccessful) {
                val body = response.body()
                NetworkHelper.logResponse(response.code(), "Success", body.toString())

                return body?.orders?.map { OrderMapper.toOrderModel(it) } ?: emptyList()
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: HttpException) {
            NetworkHelper.logError("OrderRepository", "HTTP Error: ${e.code()}", e)
            throw Exception("Lỗi kết nối: ${e.code()}")
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error getting orders", e)
            throw Exception("Lỗi tải danh sách đơn hàng: ${e.message}")
        }
    }

    suspend fun getStatistics(): OrderStatisticsModel {
        try {
            NetworkHelper.logRequest("admin/orders/statistics", "GET")

            val response = apiService.getStatistics()

            if (response.isSuccessful) {
                val body = response.body()
                NetworkHelper.logResponse(response.code(), "Success", body.toString())

                return body?.let { OrderMapper.toStatisticsModel(it) } ?: OrderStatisticsModel()
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error getting statistics", e)
            throw Exception("Lỗi tải thống kê: ${e.message}")
        }
    }

    suspend fun getOrderDetail(id: Int): OrderModel {
        try {
            NetworkHelper.logRequest("admin/orders/$id", "GET")

            val response = apiService.getOrderDetail(id)

            if (response.isSuccessful) {
                val body = response.body()
                NetworkHelper.logResponse(response.code(), "Success", body.toString())

                return body?.let { OrderMapper.toOrderModel(it) } ?: throw Exception("Không có dữ liệu")
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error getting order detail", e)
            throw Exception("Lỗi tải chi tiết đơn hàng: ${e.message}")
        }
    }

    suspend fun createOrder(
            userId: Int,
            price: Int,
            status: String,
            items: List<CreateOrderItemRequest>
    ): OrderModel {
        try {
            val request = CreateOrderRequest(
                    userId = userId,
                    price = price,
                    status = status,
                    items = items
            )

            NetworkHelper.logRequest("admin/orders", "POST")

            val response = apiService.createOrder(request)

            if (response.isSuccessful) {
                val body = response.body()
                NetworkHelper.logResponse(response.code(), "Success", body.toString())

                return body?.let { OrderMapper.toOrderModel(it) } ?: throw Exception("Không có dữ liệu trả về")
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error creating order", e)
            throw Exception("Lỗi tạo đơn hàng: ${e.message}")
        }
    }

    suspend fun updateOrder(
            id: Int,
            userId: Int? = null,
            price: Int? = null,
            status: String? = null,
            items: List<CreateOrderItemRequest>? = null
    ): OrderModel {
        try {
            val request = UpdateOrderRequest(
                    userId = userId,
                    price = price,
                    status = status,
                    items = items
            )

            NetworkHelper.logRequest("admin/orders/$id", "PATCH")

            val response = apiService.updateOrder(id, request)

            if (response.isSuccessful) {
                val body = response.body()
                NetworkHelper.logResponse(response.code(), "Success", body.toString())

                return body?.let { OrderMapper.toOrderModel(it) } ?: throw Exception("Không có dữ liệu trả về")
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error updating order", e)
            throw Exception("Lỗi cập nhật đơn hàng: ${e.message}")
        }
    }

    suspend fun updateOrderStatus(id: Int, status: String) {
        try {
            val request = UpdateOrderStatusRequest(status = status)

            NetworkHelper.logRequest("admin/orders/$id/status", "PUT")

            val response = apiService.updateOrderStatus(id, request)

            if (response.isSuccessful) {
                NetworkHelper.logResponse(response.code(), "Success")
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error updating order status", e)
            throw Exception("Lỗi cập nhật trạng thái: ${e.message}")
        }
    }

    suspend fun deleteOrder(id: Int) {
        try {
            NetworkHelper.logRequest("admin/orders/$id", "DELETE")

            val response = apiService.deleteOrder(id)

            if (response.isSuccessful) {
                NetworkHelper.logResponse(response.code(), "Success")
            } else {
                val errorMsg = "HTTP ${response.code()}: ${response.message()}"
                NetworkHelper.logResponse(response.code(), errorMsg)
                throw Exception(errorMsg)
            }
        } catch (e: Exception) {
            NetworkHelper.logError("OrderRepository", "Error deleting order", e)
            throw Exception("Lỗi xóa đơn hàng: ${e.message}")
        }
    }
}