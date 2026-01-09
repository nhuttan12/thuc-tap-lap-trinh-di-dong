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

class CheckToken(private val tinyDB: TinyDB) {
    /**
     * @description Tag for logging
     */
    private val TAG: String = "CheckToken"

    fun checkTokenOrRedirect(context: Context, onTokenValid: () -> Unit) {
        val token: String? = tinyDB.getToken()

        /**
         * Checking current token
         */
        Log.d(TAG, "Check current token -> $token")

        if (token.isNullOrEmpty()) {
            /**
             * Redirect to login activity if no token
             */
            val intent = Intent(context, LoginActivity::class.java)

            /**
             * If no token, need flag
             */
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)

            context.startActivity(intent)

            if (context is Activity) {
                context.finish()
            }
        } else {
            onTokenValid()
        }
    }
}
