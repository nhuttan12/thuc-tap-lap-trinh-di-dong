package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import org.json.JSONObject

class ResetPasswordActivity : AppCompatActivity() {

    private lateinit var etNewPass: TextInputEditText
    private lateinit var btnReset: MaterialButton
    private var token: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.reset_password_activity)

        etNewPass = findViewById(R.id.etNewPassword)
        btnReset = findViewById(R.id.btnResetPassword)

        token = intent.getStringExtra("token")

        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Phiên đặt lại mật khẩu không hợp lệ", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        btnReset.setOnClickListener {
            val newPass = etNewPass.text.toString().trim()
            when {
                newPass.isEmpty() -> {
                    Toast.makeText(this, "Nhập mật khẩu mới", Toast.LENGTH_SHORT).show()
                }
                newPass.length < 6 -> {
                    Toast.makeText(this, "Mật khẩu phải ít nhất 6 ký tự", Toast.LENGTH_SHORT).show()
                }
                else -> {
                    resetPassword(token!!, newPass)
                }
            }
        }

    }
    private fun resetPassword(token: String, newPassword: String) {
        val url = "http://10.0.2.2:8080/auth/reset-password"

        val body = JSONObject()
        body.put("resetToken", token)
        body.put("newPassword", newPassword)

        val request = JsonObjectRequest(
            Request.Method.POST,
            url,
            body,
            { response ->
                Toast.makeText(
                    this,
                    response.getString("message"),
                    Toast.LENGTH_SHORT
                ).show()

                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            },
            { error ->
                Toast.makeText(this, "Đổi mật khẩu thất bại", Toast.LENGTH_SHORT).show()
            }
        )

        Volley.newRequestQueue(this).add(request)
    }
}