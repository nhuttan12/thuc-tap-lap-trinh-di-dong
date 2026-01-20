package com.example.admin.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.admin.model.OrderModel
import com.example.admin.model.OrderStatisticsModel
import com.example.admin.repository.OrderRepository
import kotlinx.coroutines.launch

class OrderViewModel : ViewModel() {

    private val repository = OrderRepository()

    private val _orders = MutableLiveData<List<OrderModel>>()
    val orders: LiveData<List<OrderModel>> = _orders

    private val _orderDetail = MutableLiveData<OrderModel?>()
    val orderDetail: LiveData<OrderModel?> = _orderDetail

    private val _statistics = MutableLiveData<OrderStatisticsModel?>()
    val statistics: LiveData<OrderStatisticsModel?> = _statistics

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun loadOrders(
            status: String? = null,
            userId: Int? = null,
            fromDate: String? = null,
            toDate: String? = null,
            page: Int = 1,
            limit: Int = 20
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val orderList = repository.getOrders(
                        status = status,
                        userId = userId,
                        fromDate = fromDate,
                        toDate = toDate,
                        page = page,
                        limit = limit
                )

                _orders.value = orderList

            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi tải danh sách đơn hàng"
                _orders.value = emptyList()
            } finally {
                _loading.value = false
            }
        }
    }

    fun loadStatistics() {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val stats = repository.getStatistics()
                _statistics.value = stats

            } catch (e: Exception) {
                _error.value = e.message ?: "Lỗi tải thống kê"
            } finally {
                _loading.value = false
            }
        }
    }

    fun getOrderDetail(id: Int) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                val order = repository.getOrderDetail(id)
                _orderDetail.value = order

            } catch (e: Exception) {
                val errorMsg = e.message ?: "Lỗi lấy chi tiết đơn hàng"
                _error.value = errorMsg
            } finally {
                _loading.value = false
            }
        }
    }

    fun createOrder(
            userId: Int,
            price: Int,
            status: String,
            items: List<com.example.admin.dto.CreateOrderItemRequest>
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("OrderViewModel", "Creating order for user $userId, price: $price")

                val newOrder = repository.createOrder(userId, price, status, items)
                Log.d("OrderViewModel", "Order created: ID ${newOrder.id}")

                // Reload orders list
                loadOrders()

            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error creating order", e)
                _error.value = "Lỗi tạo đơn hàng: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateOrder(
            id: Int,
            userId: Int? = null,
            price: Int? = null,
            status: String? = null,
            items: List<com.example.admin.dto.CreateOrderItemRequest>? = null
    ) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                Log.d("OrderViewModel", "Updating order $id")

                val updatedOrder = repository.updateOrder(id, userId, price, status, items)
                Log.d("OrderViewModel", "Order updated: ID ${updatedOrder.id}")

                // Refresh detail và list
                getOrderDetail(id)
                loadOrders()

            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error updating order", e)
                _error.value = "Lỗi cập nhật đơn hàng: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun updateOrderStatus(id: Int, status: String) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                repository.updateOrderStatus(id, status)

                // Refresh data
                getOrderDetail(id)
                loadOrders()

            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error updating order status", e)
                _error.value = "Lỗi cập nhật trạng thái: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun deleteOrder(id: Int) {
        viewModelScope.launch {
            try {
                _loading.value = true
                _error.value = null

                // Optimistic update: Xoá ngay trong UI
                val currentList = _orders.value?.toMutableList() ?: mutableListOf()
                currentList.removeAll { it.id == id }
                _orders.value = currentList

                // Call API to delete
                repository.deleteOrder(id)

            } catch (e: Exception) {
                Log.e("OrderViewModel", "Error deleting order", e)

                // Nếu lỗi, reload list
                loadOrders()

                _error.value = "Lỗi xoá đơn hàng: ${e.message}"
            } finally {
                _loading.value = false
            }
        }
    }

    fun clearError() {
        _error.value = null
    }

    fun clearOrderDetail() {
        _orderDetail.value = null
    }


}