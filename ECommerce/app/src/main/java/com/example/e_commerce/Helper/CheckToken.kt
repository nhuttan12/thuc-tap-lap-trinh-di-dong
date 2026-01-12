/**
 * @description Class created for manage token
 * @author @nhuttan12
 * @since 2026-01-09
 * @version 1.0.0
 */

package com.example.e_commerce.Helper

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import com.example.e_commerce.Activity.LoginActivity
import org.json.JSONObject

class CheckToken(private val tinyDB: TinyDB) {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "CheckToken"

    fun checkTokenOrRedirect(activity: Activity, onTokenValid: () -> Unit) {
        val token: String? = tinyDB.getValidToken()

        /**
         * Checking current token
         */
        Log.d(TAG, "Check current token -> $token")

        if (token.isNullOrEmpty()) {
            val intent = Intent(activity, LoginActivity::class.java)
            activity.startActivity(intent)
            activity.finish()
        } else {
            onTokenValid()
        }
    }

    fun decodeJwtExpireAt(token: String): Long {
        val parts = token.split(".")
        if (parts.size != 3) return 0L

        val payload = String(
            android.util.Base64.decode(
                parts[1],
                android.util.Base64.URL_SAFE
            )
        )

        val json = JSONObject(payload)
        val expSeconds = json.optLong("exp", 0L)

        return expSeconds * 1000
    }

}
