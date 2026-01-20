package com.example.admin.helper

import android.util.Log

object NetworkHelper {
    private const val TAG = "NetworkDebug"

//    val apiService: ApiService by lazy {
//        Retrofit.Builder()
//                .baseUrl("http://10.0.2.2:8080/")
//                .addConverterFactory(GsonConverterFactory.create())
//                .build()
//                .create(ApiService::class.java)
//    }

    fun logRequest(url: String, method: String) {
        Log.d(TAG, "🌐 Request: $method $url")
    }

    fun logResponse(code: Int, message: String, body: String? = null) {
        Log.d(TAG, "📡 Response: $code - $message")
        body?.let {
            Log.d(TAG, "📦 Body: $it")
        }
    }

    fun logError(tag: String, message: String, error: Throwable? = null) {
        Log.e(TAG, "❌ $tag: $message")
        error?.printStackTrace()
    }
}