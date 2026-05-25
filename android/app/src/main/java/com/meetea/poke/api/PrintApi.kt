package com.meetea.poke.api

import com.meetea.poke.api.models.Order
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface PrintApi {
    @GET("api/print-queue")
    suspend fun printQueue(): List<Order>

    @GET("api/recent-orders")
    suspend fun recentOrders(): List<Order>

    @POST("api/orders/{id}/stampa")
    suspend fun markStampato(@Path("id") id: Int)
}
