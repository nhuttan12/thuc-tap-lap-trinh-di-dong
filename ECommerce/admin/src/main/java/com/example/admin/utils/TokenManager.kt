package com.example.admin.utils

import android.content.Context
import android.content.SharedPreferences

object TokenManager {

    private const val PREF = "auth_pref"
    private const val KEY_TOKEN = "token"
    private const val KEY_USER_ID = "user_id"
    private const val KEY_USER_ROLE = "user_role"
    private const val KEY_USER_EMAIL = "user_email"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREF, Context.MODE_PRIVATE)
    }

    fun save(context: Context, token: String) {
        getPrefs(context).edit()
                .putString(KEY_TOKEN, token)
                .apply()
    }

    fun get(context: Context): String? {
        return getPrefs(context).getString(KEY_TOKEN, null)
    }

    fun clear(context: Context) {
        getPrefs(context).edit()
                .remove(KEY_TOKEN)
                .remove(KEY_USER_ID)
                .remove(KEY_USER_ROLE)
                .remove(KEY_USER_EMAIL)
                .apply()
    }

    // Lưu thông tin user
    fun saveUserInfo(context: Context, userId: Int, role: String, email: String) {
        getPrefs(context).edit()
                .putInt(KEY_USER_ID, userId)
                .putString(KEY_USER_ROLE, role)
                .putString(KEY_USER_EMAIL, email)
                .apply()
    }

    fun getUserId(context: Context): Int {
        return getPrefs(context).getInt(KEY_USER_ID, 0)
    }

    fun getUserRole(context: Context): String? {
        return getPrefs(context).getString(KEY_USER_ROLE, null)
    }

    fun getUserEmail(context: Context): String? {
        return getPrefs(context).getString(KEY_USER_EMAIL, null)
    }

    fun isLoggedIn(context: Context): Boolean {
        return !get(context).isNullOrEmpty()
    }
}