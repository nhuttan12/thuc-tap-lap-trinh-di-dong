package com.example.e_commerce.Helper

class StringConverter {
    fun splitDescription(description: String): List<String> {
        return description
            .split(";")
            .map { it.trim() }
            .filter { it.isNotEmpty() }
    }
}