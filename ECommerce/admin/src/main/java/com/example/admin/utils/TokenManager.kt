package com.example.admin.utils

import android.content.Context

object TokenManager {

    private const val PREF = "auth_pref"
    private const val KEY = "token"

    fun save(context: Context, token: String) {
        context.getSharedPreferences(PREF, Context.MODE_PRIVATE)
                .edit()
                .putString(KEY, token)
                .apply()
    }

    fun get(context: Context): String? =
            context.getSharedPreferences(PREF, Context.MODE_PRIVATE)
                    .getString(KEY, null)
}


