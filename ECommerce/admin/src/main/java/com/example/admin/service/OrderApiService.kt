package com.example.admin.service

import com.example.admin.dto.*
import retrofit2.Response
import retrofit2.http.*

interface OrderApiService {

    @GET("admin/orders")
    suspend fun getOrders(
            @Query("status") status: String? = null,
            @Query("userId") userId: Int? = null,
            @Query("fromDate") fromDate: String? = null,
            @Query("toDate") toDate: String? = null,
            @Query("page") page: Int = 1,
            @Query("limit") limit: Int = 20
    ): Response<OrderListResponse>

    @GET("admin/orders/statistics")
    suspend fun getStatistics(): Response<OrderStatisticsDTO>

    @GET("admin/orders/{id}")
    suspend fun getOrderDetail(
            @Path("id") id: Int
    ): Response<OrderDTO>

    @POST("admin/orders")
    suspend fun createOrder(
            @Body body: CreateOrderRequest
    ): Response<OrderDTO>

    @PATCH("admin/orders/{id}")
    suspend fun updateOrder(
            @Path("id") id: Int,
            @Body body: UpdateOrderRequest
    ): Response<OrderDTO>

    @PUT("admin/orders/{id}/status")
    suspend fun updateOrderStatus(
            @Path("id") id: Int,
            @Body body: UpdateOrderStatusRequest
    ): Response<Void>

    @DELETE("admin/orders/{id}")
    suspend fun deleteOrder(
            @Path("id") id: Int
    ): Response<Void>
}