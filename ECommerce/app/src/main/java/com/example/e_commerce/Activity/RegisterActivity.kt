package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.R
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Helper.TinyDB
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import org.json.JSONObject

class RegisterActivity : AppCompatActivity() {
    private lateinit var emailLayout: TextInputLayout
    private lateinit var userNameLayout: TextInputLayout
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var rePasswordLayout: TextInputLayout
    private val tinyDB: TinyDB by lazy { TinyDB(this) }
    private val checkToken: CheckToken by lazy { CheckToken(tinyDB) }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // 🔹 Layout (để show error)
        emailLayout = findViewById(R.id.emailInput)
        userNameLayout = findViewById(R.id.userNameInput)
        passwordLayout = findViewById(R.id.passwordInput)
        rePasswordLayout = findViewById(R.id.rePasswordInput)

        val edtEmail = findViewById<TextInputEditText>(R.id.etEmail)
        val edtUserName = findViewById<TextInputEditText>(R.id.etUserName)
        val edtPassWord = findViewById<TextInputEditText>(R.id.etPassword)
        val edtRePassword = findViewById<TextInputEditText>(R.id.etRePassword)
        val btnDangKy = findViewById<MaterialButton>(R.id.btnRegister)

        // Set sự kiện bấm nút đăng ký
        btnDangKy.setOnClickListener {

            clearError()

            val email = edtEmail.text.toString().trim()
            val username = edtUserName.text.toString().trim()
            val password = edtPassWord.text.toString()
            val rePassword = edtRePassword.text.toString()

            // Validate dữ liệu
            if (!validateRegister(email, username, password, rePassword)) {
                return@setOnClickListener
            }

            //GỬi đăng ký
            sendRegisterRequest(email, username, password, rePassword)
        }

    }

    // Hàm gửi request Đăng ký lên backend
    private fun sendRegisterRequest(
        email: String,
        username: String,
        password: String,
        rePassword: String
    ) {
        //url gọi backend
        val url = "http://10.0.2.2:8080/auth/sign-up"

        // Tạo JSON body
        val jsonBody = JSONObject().apply {
            put("email", email)
            put("username", username)
            put("password", password)
            put("retypePassword", rePassword)
        }

        //Taoj request POST gửi JSON lên backend
        val request = JsonObjectRequest(
            Request.Method.POST,
            url,
            jsonBody,
            {
                autoLogin(username, password)
            },
            // Đăng ký thất bại
            { error ->
                val errorMsg = error.networkResponse?.data?.let {
                    JSONObject(String(it)).optString("message", "Đăng ký thất bại")
                } ?: "Không thể kết nối server"
                Toast.makeText(this, errorMsg, Toast.LENGTH_LONG).show()
            }
        )
        // Gửi request
        Volley.newRequestQueue(this).add(request)
    }

    //Hàm validate dữ liệu trong form đăng ký
    private fun validateRegister(
        email: String,
        username: String,
        password: String,
        rePassword: String
    ): Boolean {

        if (email.isEmpty()) {
            emailLayout.error = "Vui lòng nhập email"
            return false
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailLayout.error = "Email không hợp lệ"
            return false
        }

        if (username.isEmpty()) {
            userNameLayout.error = "Vui lòng nhập username"
            return false
        }

        if (password.length < 6) {
            passwordLayout.error = "Mật khẩu tối thiểu 6 ký tự"
            return false
        }

        if (password != rePassword) {
            rePasswordLayout.error = "Mật khẩu nhập lại không khớp"
            return false
        }

        return true

    }

    private fun clearError() {
        emailLayout.error = null
        userNameLayout.error = null
        passwordLayout.error = null
        rePasswordLayout.error = null
    }

    private fun autoLogin(username: String, password: String) {

        val url = "http://10.0.2.2:8080/auth/login"

        val params = HashMap<String, String>()
        params["username"] = username
        params["password"] = password

        val request = object : StringRequest(
            Method.POST,
            url,
            {
                val json = JSONObject(it)
                val token = json.optString("accessToken")

                val expireAt = checkToken.decodeJwtExpireAt(token)

//                saveToken(token)
                tinyDB.setToken(token, expireAt)

                Toast.makeText(this, "Đăng ký & đăng nhập thành công", Toast.LENGTH_SHORT).show()

                startActivity(Intent(this, SplashActivity::class.java))
                finish()
            },
            {
                Toast.makeText(this, "Auto login thất bại", Toast.LENGTH_LONG).show()
                startActivity(Intent(this, LoginActivity::class.java))
                finish()
            }
        ) {
            override fun getParams(): MutableMap<String, String> = params
        }

        Volley.newRequestQueue(this).add(request)
    }

//    private fun saveToken(token: String) {
//        getSharedPreferences("APP_PREF", MODE_PRIVATE)
//            .edit()
//            .putString("ACCESS_TOKEN", token)
//            .apply()
//    }
}