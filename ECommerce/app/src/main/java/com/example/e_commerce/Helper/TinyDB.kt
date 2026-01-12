package com.example.e_commerce.Helper

import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.content.SharedPreferences
import android.graphics.Bitmap
import android.os.Environment
import android.text.TextUtils
import android.util.Log
import androidx.core.content.edit
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Model.ProductDetailModel
import com.example.e_commerce.Provider.MoshiProvider
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

class TinyDB(context: Context) {
    private val preferences: SharedPreferences =
        context.getSharedPreferences("APP_PREF", Context.MODE_PRIVATE)

    private val ACCESS_TOKEN = "ACCESS_TOKEN"
    private val KEY_EXPIRE_AT = "EXPIRE_AT"

    private var defaultImageDir: String? = null
    private var lastImagePath: String = ""

    private val moshi = MoshiProvider.moshi

    fun isExternalStorageWritable(): Boolean =
        Environment.MEDIA_MOUNTED == Environment.getExternalStorageState()

    fun isExternalStorageReadable(): Boolean {
        val state = Environment.getExternalStorageState()
        return state == Environment.MEDIA_MOUNTED ||
                state == Environment.MEDIA_MOUNTED_READ_ONLY
    }

//    fun getImage(path: String?): Bitmap? =
//        try {
//            path?.let { BitmapFactory.decodeFile(it) }
//        } catch (e: Exception) {
//            null
//        }
//
//    fun getSavedImagePath(): String = lastImagePath
//
//    fun putImage(folder: String?, imageName: String?, bitmap: Bitmap?): String? {
//        if (folder == null || imageName == null || bitmap == null) return null
//
//        defaultImageDir = folder
//        val fullPath = setupFullPath(imageName)
//
//        if (fullPath.isNotEmpty()) {
//            lastImagePath = fullPath
//            saveBitmap(fullPath, bitmap)
//        }
//        return fullPath
//    }

//    fun putImageWithFullPath(fullPath: String?, bitmap: Bitmap?): Boolean =
//        fullPath != null && bitmap != null && saveBitmap(fullPath, bitmap)

    private fun setupFullPath(imageName: String): String {
        val folder = File(
            Environment.getExternalStorageDirectory(),
            defaultImageDir ?: return ""
        )

        if (isExternalStorageReadable() && isExternalStorageWritable() && !folder.exists()) {
            if (!folder.mkdirs()) {
                Log.e("TinyDB", "Failed to create directory")
                return ""
            }
        }
        return "${folder.path}/$imageName"
    }

    private fun saveBitmap(path: String, bitmap: Bitmap): Boolean {
        val file = File(path)
        if (file.exists() && !file.delete()) return false

        return try {
            file.createNewFile()
            FileOutputStream(file).use {
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, it)
            }
            true
        } catch (e: IOException) {
            false
        }
    }

//    fun getInt(key: String): Int = preferences.getInt(key, 0)
//    fun getLong(key: String): Long = preferences.getLong(key, 0L)
//    fun getFloat(key: String): Float = preferences.getFloat(key, 0f)
//    fun getBoolean(key: String): Boolean = preferences.getBoolean(key, false)
//    fun getString(key: String): String = preferences.getString(key, "") ?: ""

//    fun getDouble(key: String): Double =
//        getString(key).toDoubleOrNull() ?: 0.0

    fun getListString(key: String): ArrayList<String> =
        ArrayList(
            TextUtils.split(preferences.getString(key, ""), "‚‗‚").toList()
        )

//    fun getListInt(key: String): ArrayList<Int> =
//        getListString(key).map { it.toInt() }.toCollection(ArrayList())
//
//    fun getListLong(key: String): ArrayList<Long> =
//        getListString(key).map { it.toLong() }.toCollection(ArrayList())
//
//    fun getListDouble(key: String): ArrayList<Double> =
//        getListString(key).map { it.toDouble() }.toCollection(ArrayList())
//
//    fun getListBoolean(key: String): ArrayList<Boolean> =
//        getListString(key).map { it == "true" }.toCollection(ArrayList())
//
//    fun <T> getObject(key: String, clazz: Class<T>): T {
//        val json = getString(key)
//        val adapter = moshi.adapter(clazz)
//
//        return adapter.fromJson(json)
//            ?: throw NullPointerException("Object is null")
//    }

    fun getListObject(key: String): ArrayList<CartItemModel> {
        val adapter = moshi.adapter(CartItemModel::class.java)
        return getListString(key).mapNotNull {
            adapter.fromJson(it)
        }.toCollection(ArrayList())
    }

//    fun putInt(key: String, value: Int) =
//        preferences.edit().putInt(key, value).apply()
//
//    fun putLong(key: String, value: Long) =
//        preferences.edit().putLong(key, value).apply()
//
//    fun putFloat(key: String, value: Float) =
//        preferences.edit().putFloat(key, value).apply()
//
//    fun putBoolean(key: String, value: Boolean) =
//        preferences.edit().putBoolean(key, value).apply()

    fun putString(key: String, value: String) =
        preferences.edit().putString(key, value).apply()

//    fun putDouble(key: String, value: Double) =
//        putString(key, value.toString())

    fun putListString(key: String, list: List<String>) =
        putString(key, TextUtils.join("‚‗‚", list))

//    fun putListInt(key: String, list: List<Int>) =
//        putListString(key, list.map { it.toString() })
//
//    fun putListLong(key: String, list: List<Long>) =
//        putListString(key, list.map { it.toString() })
//
//    fun putListDouble(key: String, list: List<Double>) =
//        putListString(key, list.map { it.toString() })
//
//    fun putListBoolean(key: String, list: List<Boolean>) =
//        putListString(key, list.map { it.toString() })
//
//    fun <T> putObject(key: String, obj: T, clazz: Class<T>) {
//        val adapter = moshi.adapter(clazz)
//        putString(key, adapter.toJson(obj))
//    }

    fun putListObject(key: String, list: List<CartItemModel>) {
        val adapter = moshi.adapter(CartItemModel::class.java)
        putListString(key, list.map { adapter.toJson(it) })
    }
//
//    fun remove(key: String) =
//        preferences.edit().remove(key).apply()
//
//    fun clear() =
//        preferences.edit().clear().apply()
//
//    fun deleteImage(path: String): Boolean =
//        File(path).delete()
//
//    fun getAll(): Map<String, *> =
//        preferences.all

    fun setToken(token: String, expireAtMillis: Long) {
        preferences.edit {
            putString(ACCESS_TOKEN, token)
            putLong(KEY_EXPIRE_AT, expireAtMillis)
        }
    }

    fun isTokenExpired(): Boolean {
        val expireAt = preferences.getLong(KEY_EXPIRE_AT, 0L)
        if (expireAt == 0L) return true

        return System.currentTimeMillis() >= expireAt
    }

    fun getValidToken(): String? {
        if (isTokenExpired()) {
            clearToken()
            return null
        }
        return preferences.getString(ACCESS_TOKEN, null)
    }

    fun clearToken() {
        preferences.edit {
            remove(ACCESS_TOKEN)
            remove(KEY_EXPIRE_AT)
        }
    }
}