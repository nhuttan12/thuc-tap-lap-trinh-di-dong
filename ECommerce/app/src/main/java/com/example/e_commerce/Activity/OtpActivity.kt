package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.R
import com.google.android.material.button.MaterialButton
import org.json.JSONObject

class OtpActivity : AppCompatActivity() {

    private lateinit var btnVerify: MaterialButton
    private var email: String? = null   // nhận từ Forgot

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_otp)

        btnVerify = findViewById(R.id.btnVerifyOtp)
        email = intent.getStringExtra("email")

        btnVerify.setOnClickListener {
            val otp = getOtp()

            if (otp.length < 6) {
                Toast.makeText(this, "Vui lòng nhập đủ OTP", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            verifyOtp(email!!, otp)
        }
    }

    private fun getOtp(): String {
        val ids = listOf(
            R.id.etOtp1, R.id.etOtp2, R.id.etOtp3,
            R.id.etOtp4, R.id.etOtp5, R.id.etOtp6
        )

        val sb = StringBuilder()
        for (id in ids) {
            sb.append(findViewById<EditText>(id).text.toString())
        }
        return sb.toString()
    }

    private fun verifyOtp(email: String, otp: String) {
        val url = "http://10.0.2.2:8080/auth/verify-otp"

        val body = JSONObject()
        body.put("email", email)
        body.put("otp", otp)

        val request = JsonObjectRequest(
            Request.Method.POST,
            url,
            body,
            { response ->
                val token = response.getString("token")

                startActivity(
                    Intent(this, ResetPasswordActivity::class.java)
                        .putExtra("token", token)
                )
            },
            { error ->
                Toast.makeText(this, "OTP không đúng hoặc đã hết hạn", Toast.LENGTH_SHORT).show()
            }
        )

        Volley.newRequestQueue(this).add(request)
    }
}