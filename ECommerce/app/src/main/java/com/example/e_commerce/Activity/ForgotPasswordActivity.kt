package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.VolleyError
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import org.json.JSONObject

class ForgotPasswordActivity : AppCompatActivity() {

    private lateinit var etEmail: TextInputEditText
    private lateinit var btnSend: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgot_pw)

        etEmail = findViewById(R.id.etEmailForgot)
        btnSend = findViewById(R.id.btnSendEmail)

        btnSend.setOnClickListener {
            val email = etEmail.text.toString().trim()

            if (email.isEmpty()) {
                Toast.makeText(this, "Vui lòng nhập email", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            sendOtp(email)
        }
    }

    private fun sendOtp(email: String) {
        val url = "http://10.0.2.2:8080/auth/forgot-password"

        val body = JSONObject()
        body.put("email", email)

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

                startActivity(
                    Intent(this, OtpActivity::class.java)
                        .putExtra("email", email)
                )
            },
            { error ->
                Toast.makeText(this, "Không gửi được OTP", Toast.LENGTH_SHORT).show()
            }
        )

        Volley.newRequestQueue(this).add(request)
    }
}
