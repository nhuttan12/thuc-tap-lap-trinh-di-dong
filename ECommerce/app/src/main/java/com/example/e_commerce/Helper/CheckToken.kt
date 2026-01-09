package com.example.e_commerce.Helper

import android.app.Activity
import android.content.Context
import android.content.Intent
import com.example.e_commerce.Activity.LoginActivity

class CheckToken(private val tinyDB: TinyDB) {
    fun checkTokenOrRedirect(context: Context, onTokenValid: () -> Unit) {
        val token: String? = tinyDB.getToken()
        if (token.isNullOrEmpty()) {
            /**
             * Redirect to login activity if no token
             */
            val intent = Intent(context, LoginActivity::class.java)

            /**
             * If no token, need flag
             */
            if (context !is Activity) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } else {
            onTokenValid()
        }
    }
}
