package com.example.admin.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.admin.R
import com.example.admin.databinding.FragmentLoginBinding
import com.example.admin.service.ApiService
import com.example.admin.service.LoginRequest
import com.example.admin.utils.TokenManager
import kotlinx.coroutines.launch

class LoginFragment : Fragment() {

    private lateinit var binding: FragmentLoginBinding

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Kiểm tra đã login chưa
        if (TokenManager.isLoggedIn(requireContext())) {
            navigateToDashboard()
            return
        }

        setupLoginButton()
    }

    private fun setupLoginButton() {
        binding.btnLogin.setOnClickListener {
            val username = binding.edtUsername.text.toString().trim()
            val password = binding.edtPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(requireContext(), "Vui lòng nhập đầy đủ thông tin", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            login(username, password)
        }
    }

    private fun login(username: String, password: String) {
        lifecycleScope.launch {
            try {
                showLoading(true)

                Log.d("LoginFragment", "Attempting login for user: $username")

                // Gửi request login - Sử dụng LoginRequest từ import
                val response = ApiService.authService.login(
                        LoginRequest(username, password)
                )

                Log.d("LoginFragment", "Response code: ${response.code()}")
                Log.d("LoginFragment", "Response body: ${response.body()}")

                if (response.isSuccessful) {
                    val loginResponse = response.body()

                    if (loginResponse != null) {
                        val token = loginResponse.accessToken

                        Log.d("LoginFragment", "Login successful! Token: $token")
                        Log.d("LoginFragment", "User ID: ${loginResponse.id}, Role: ${loginResponse.role}")

                        if (token.isNotEmpty()) {
                            // Lưu token
                            TokenManager.save(requireContext(), token)
                            // Lưu thông tin user
                            TokenManager.saveUserInfo(
                                    requireContext(),
                                    loginResponse.id,
                                    loginResponse.role,
                                    loginResponse.email
                            )
                            // Cập nhật token trong ApiService
                            ApiService.updateToken(token)

                            Toast.makeText(
                                    requireContext(),
                                    "Đăng nhập thành công!\nRole: ${loginResponse.role}",
                                    Toast.LENGTH_SHORT
                            ).show()

                            navigateToDashboard()
                        } else {
                            throw Exception("Token rỗng")
                        }
                    } else {
                        throw Exception("Response body null")
                    }
                } else {
                    val errorCode = response.code()
                    val errorBody = response.errorBody()?.string()
                    Log.e("LoginFragment", "Login failed: $errorCode - $errorBody")

                    when (errorCode) {
                        401 -> throw Exception("Sai tên đăng nhập hoặc mật khẩu")
                        404 -> throw Exception("Endpoint không tồn tại")
                        500 -> throw Exception("Lỗi server")
                        else -> throw Exception("Lỗi HTTP $errorCode: $errorBody")
                    }
                }

            } catch (e: Exception) {
                Log.e("LoginFragment", "Login error: ${e.message}", e)
                Toast.makeText(
                        requireContext(),
                        "Đăng nhập thất bại: ${e.message}",
                        Toast.LENGTH_LONG
                ).show()
            } finally {
                showLoading(false)
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        binding.btnLogin.isEnabled = !isLoading
        binding.btnLogin.text = if (isLoading) "Đang đăng nhập..." else "Đăng nhập"
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
    }

    private fun navigateToDashboard() {
        try {
            // Delay một chút để user thấy toast message
            lifecycleScope.launch {
                kotlinx.coroutines.delay(1000)
                findNavController().navigate(R.id.action_login_to_dashboardFragment)
            }
        } catch (e: Exception) {
            Log.e("LoginFragment", "Navigation error: ${e.message}")
            Toast.makeText(
                    requireContext(),
                    "Lỗi chuyển trang",
                    Toast.LENGTH_SHORT
            ).show()
        }
    }
}