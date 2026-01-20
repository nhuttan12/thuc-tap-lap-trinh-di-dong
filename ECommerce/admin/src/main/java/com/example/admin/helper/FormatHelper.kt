package com.example.admin.helper

import java.text.NumberFormat
import java.util.Locale

object FormatHelper {

    fun formatCurrency(amount: Double): String {
        val formatter = NumberFormat.getInstance(Locale("vi", "VN"))
        return "${formatter.format(amount)}₫"
    }

    fun formatCurrency(amount: Int): String {
        return formatCurrency(amount.toDouble())
    }
}