package com.example.admin.fragment

import android.os.Bundle
import android.view.View
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

class LoginFragment : Fragment(R.layout.fragment_login) {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentLoginBinding.bind(view)

        binding.btnLogin.setOnClickListener {
            login()
        }
    }

    private fun login() {
        val email = binding.edtEmail.text.toString().trim()
        val password = binding.edtPassword.text.toString().trim()

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(requireContext(), "Nhập đủ thông tin", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val response = ApiService.authService.login(
                        LoginRequest(email, password)
                )

                if (response.isSuccessful) {
                    val token = response.body()?.data?.accessToken
                    if (!token.isNullOrEmpty()) {
                        TokenManager.save(requireContext(), token)

                        findNavController().navigate(R.id.dashboardFragment)
                    }
                } else {
                    Toast.makeText(requireContext(), "Login thất bại", Toast.LENGTH_SHORT).show()
                }

            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Lỗi kết nối", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
