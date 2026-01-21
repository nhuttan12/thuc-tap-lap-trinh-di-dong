package com.example.admin.fragment

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.annotation.RequiresApi
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

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Kiểm tra đã login chưa
        if (TokenManager.isLoggedIn(requireContext())) {
            navigateToDashboard()
            return
        }

        setupLoginButton()
    }

    @RequiresApi(Build.VERSION_CODES.O)
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

    @RequiresApi(Build.VERSION_CODES.O)
    private fun login(username: String, password: String) {
        lifecycleScope.launch {
            try {
                showLoading(true)

                Log.d("LoginFragment", "Login attempt: $username")

                val response = ApiService.authService.login(
                        LoginRequest(username, password)
                )

                Log.d("LoginFragment", "Response: ${response.code()}")
                Log.d("LoginFragment", "Response body: ${response.body()}")

                if (response.isSuccessful) {
                    val loginResponse = response.body()

                    if (loginResponse != null && loginResponse.accessToken.isNotEmpty()) {
                        // Lưu token
                        TokenManager.save(requireContext(), loginResponse.accessToken)

                        // Log token để debug
                        Log.d("LoginFragment", "Token saved: ${loginResponse.accessToken.take(50)}...")
                        Log.d("LoginFragment", "User role: ${loginResponse.role}")

                        // Kiểm tra token trên jwt.io (debug)
                        val tokenParts = loginResponse.accessToken.split(".")
                        if (tokenParts.size == 3) {
                            try {
                                val payload = String(java.util.Base64.getDecoder().decode(tokenParts[1]))
                                Log.d("LoginFragment", "Token payload: $payload")
                            } catch (e: Exception) {
                                Log.e("LoginFragment", "Error decoding token: ${e.message}")
                            }
                        }

                        Toast.makeText(
                                requireContext(),
                                "Đăng nhập thành công! Role: ${loginResponse.role}",
                                Toast.LENGTH_SHORT
                        ).show()

                        navigateToDashboard()
                    }
                }
            } catch (e: Exception) {
                Log.e("LoginFragment", "Login error", e)
                Toast.makeText(requireContext(), "Đăng nhập thất bại: ${e.message}", Toast.LENGTH_LONG).show()
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