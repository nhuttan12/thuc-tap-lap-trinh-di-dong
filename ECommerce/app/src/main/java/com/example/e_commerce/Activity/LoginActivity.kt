package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.R
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import org.json.JSONObject

class LoginActivity : AppCompatActivity() {
    private val tinyDB: TinyDB by lazy { TinyDB(this) }
    private val checkToken: CheckToken by lazy { CheckToken(tinyDB) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        setUpSignUpEvent();
        setUpForgotPasswordEvent();
        setUpLoginEvent();
    }

    private fun setUpSignUpEvent() {
        val tvSignUp = findViewById<TextView>(R.id.tvSignUp)
        tvSignUp.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setUpForgotPasswordEvent() {
        val tvForgot = findViewById<TextView>(R.id.tvForgot)
        tvForgot.setOnClickListener {
            val intent = Intent(this, ForgotPasswordActivity::class.java)
            startActivity(intent)
        }
    }

    private fun sendLoginRequest(username: String, password: String) {

        val url = "http://10.0.2.2:8080/auth/login"

        val params = HashMap<String, String>()
        params["username"] = username
        params["password"] = password

        val request = object : StringRequest(
            Method.POST,
            url,
            Response.Listener { response ->

                val json = JSONObject(response)
                val accessToken = json.optString("accessToken")

                val expireAt = checkToken.decodeJwtExpireAt(accessToken)

                if (accessToken.isNotEmpty()) {
//                    saveToken(accessToken)
                    tinyDB.setToken(accessToken, expireAt)

                    Toast.makeText(
                        this,
                        "Đăng nhập thành công",
                        Toast.LENGTH_SHORT
                    ).show()

//                    startActivity(
//                        Intent(this, SplashActivity::class.java)
//                    )
                    startActivity(
                        Intent(this, HomeActivity::class.java)
                    )
                    finish()
                } else {
                    Toast.makeText(
                        this,
                        "Login thất bại",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            },
            Response.ErrorListener { error ->

                val errorMsg = error.networkResponse?.data?.let {
                    JSONObject(String(it)).optString(
                        "message",
                        "Sai username hoặc mật khẩu"
                    )
                } ?: "Không thể kết nối server"

                Toast.makeText(this, errorMsg, Toast.LENGTH_LONG).show()
            }
        ) {
            override fun getParams(): MutableMap<String, String> {
                return params
            }
        }

        Volley.newRequestQueue(this).add(request)
    }

    private fun setUpLoginEvent() {

        val edtUsername = findViewById<TextInputEditText>(R.id.etUserName)
        val edtPassword = findViewById<TextInputEditText>(R.id.etPassword)
        val btnLogin = findViewById<MaterialButton>(R.id.btnSignIn)

        btnLogin.setOnClickListener {

            val username = edtUsername.text.toString().trim()
            val password = edtPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(
                    this,
                    "Vui lòng nhập username và mật khẩu",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            sendLoginRequest(username, password)
        }
    }

//    private fun saveToken(token: String) {
//        val sharedPreferences = getSharedPreferences("APP_PREF", MODE_PRIVATE)
//        sharedPreferences
//            .edit()
//            .putString("ACCESS_TOKEN", token)
//            .apply()
//    }
}
