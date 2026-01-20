package com.example.admin.fragment

import android.util.Log
import com.example.admin.model.Product

// ProductCache.kt
object ProductCache {
    private val cache = mutableMapOf<Int, Product>()

    fun save(product: Product) {
        cache[product.id] = product
        Log.d("ProductCache", "Saved product ${product.id}: ${product.name}")
    }

    fun get(productId: Int): Product? {
        return cache[productId]
    }

    fun update(product: Product) {
        save(product)
    }

    fun remove(id: Int) {
        cache.remove(id)
        println("🗑️ Removed product $id from cache")
    }

    fun getAll(): List<Product> {
        return cache.values.toList()
    }

    fun clear() {
        cache.clear()
        println("🧹 Cleared all product cache")
    }
}