package com.example.admin.fragment

import com.example.admin.model.Product

// ProductCache.kt
object ProductCache {
    private val cache = mutableMapOf<Int, Product>()

    fun save(product: Product) {
        cache[product.id] = product
        println("💾 Cached product ${product.id}: ${product.name}")
    }

    fun get(id: Int): Product? {
        return cache[id]
    }

    fun update(product: Product) {
        cache[product.id] = product
        println("🔄 Updated cache for product ${product.id}")
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