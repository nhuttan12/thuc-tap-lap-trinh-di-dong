package com.example.admin

import android.app.Application
import android.content.Context

class AdminApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    companion object {
        private lateinit var instance: AdminApplication
        val context: Context
            get() = instance.applicationContext
    }
}
