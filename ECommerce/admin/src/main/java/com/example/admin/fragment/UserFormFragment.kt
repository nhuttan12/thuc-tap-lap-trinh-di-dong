package com.example.admin.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.example.admin.databinding.FragmentUserFormBinding
import com.example.admin.viewmodel.UserViewModel
import kotlinx.coroutines.launch

class UserFormFragment : Fragment() {

    private lateinit var binding: FragmentUserFormBinding
    private lateinit var viewModel: UserViewModel

    // Role mapping: name -> id
    private val roleNames = listOf("admin", "staff", "customer")
    private val roleNameToId = mapOf(
            "admin" to 1,
            "staff" to 2,
            "customer" to 3
    )

    private val statusOptions = listOf("ACTIVE", "INACTIVE", "BANNED")

    private var isEditMode = false
    private var userId = 0
    private var preloadedUserData: Map<String, String>? = null

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = FragmentUserFormBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        arguments?.let {
            isEditMode = it.getBoolean("isEditMode", false)
            userId = it.getInt("userId", 0)

            if (it.containsKey("preloadedData")) {
                preloadedUserData = it.getSerializable("preloadedData") as? Map<String, String>
                Log.d("UserFormFragment", "Got preloaded data: $preloadedUserData")
            }

            Log.d("UserFormFragment", "Mode: ${if (isEditMode) "EDIT" else "CREATE"}, UserID: $userId")
        }

        viewModel = UserViewModel()

        setupUI()
        setupRoleSpinner()
        setupStatusSpinner()
        setupButton()

        // Nếu là edit mode, load data
        if (isEditMode) {
            if (preloadedUserData != null) {
                loadPreloadedData()
            } else if (userId > 0) {
                loadUserData()
            }
        }
    }

    private fun setupUI() {
        val title = if (isEditMode) "Sửa người dùng" else "Thêm người dùng"
        binding.tvTitle.text = title

        if (isEditMode) {
            // Ẩn password field
            binding.layoutPassword.visibility = View.GONE

            // HIỆN FullName field
            binding.layoutFullName.visibility = View.VISIBLE

            // Sửa hint username (chỉ hiển thị, không edit)
            binding.edtUsername.isEnabled = false
            binding.edtUsername.setTextColor(ContextCompat.getColor(requireContext(), android.R.color.darker_gray))
        } else {
            binding.layoutFullName.visibility = View.GONE
            binding.edtUsername.isEnabled = true
        }
    }

    private fun setupRoleSpinner() {
        val roleAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_spinner_item,
                roleNames
        )
        roleAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerRole.adapter = roleAdapter
    }

    private fun setupStatusSpinner() {
        val statusAdapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_spinner_item,
                statusOptions
        )
        statusAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerStatus.adapter = statusAdapter
    }

    private fun loadPreloadedData() {
        Log.d("UserFormFragment", "Loading preloaded data: $preloadedUserData")

        preloadedUserData?.let { data ->
            binding.edtUsername.setText(data["username"] ?: "")
            binding.edtEmail.setText(data["email"] ?: "")
            binding.edtFullName.setText(data["fullName"] ?: data["username"] ?: "")

            // Set role
            val role = data["role"] ?: "customer"
            val rolePosition = roleNames.indexOfFirst {
                it.equals(role, ignoreCase = true)
            }
            if (rolePosition >= 0) {
                binding.spinnerRole.setSelection(rolePosition)
            }

            // Set status
            val status = data["status"] ?: "ACTIVE"
            val statusPosition = statusOptions.indexOfFirst {
                it.equals(status, ignoreCase = true)
            }
            if (statusPosition >= 0) {
                binding.spinnerStatus.setSelection(statusPosition)
            }

            binding.btnSaveUser.isEnabled = true
            binding.btnSaveUser.text = "Cập nhật"

            Toast.makeText(requireContext(), "Đã tải thông tin user", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadUserData() {
        // Tạm thời không gọi API vì BE bị lỗi
        binding.btnSaveUser.isEnabled = true
        binding.btnSaveUser.text = "Cập nhật"
    }

    private fun setupButton() {
        binding.btnSaveUser.setOnClickListener {
            if (validateForm()) {
                if (isEditMode) {
                    updateUser()
                } else {
                    createUser()
                }
            }
        }

        binding.btnCancel.setOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun validateForm(): Boolean {
        val username = binding.edtUsername.text.toString().trim()
        val email = binding.edtEmail.text.toString().trim()
        val password = binding.edtPassword.text.toString().trim()
        val fullName = if (isEditMode) binding.edtFullName.text.toString().trim() else ""

        if (username.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng nhập username", Toast.LENGTH_SHORT).show()
            return false
        }

        if (email.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng nhập email", Toast.LENGTH_SHORT).show()
            return false
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(requireContext(), "Email không hợp lệ", Toast.LENGTH_SHORT).show()
            return false
        }

        if (isEditMode && fullName.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng nhập họ và tên", Toast.LENGTH_SHORT).show()
            return false
        }

        if (!isEditMode && password.isEmpty()) {
            Toast.makeText(requireContext(), "Vui lòng nhập password", Toast.LENGTH_SHORT).show()
            return false
        }

        if (!isEditMode && password.length < 6) {
            Toast.makeText(requireContext(), "Password phải có ít nhất 6 ký tự", Toast.LENGTH_SHORT).show()
            return false
        }

        return true
    }

    private fun createUser() {
        val username = binding.edtUsername.text.toString().trim()
        val email = binding.edtEmail.text.toString().trim()
        val password = binding.edtPassword.text.toString().trim()
        val status = binding.spinnerStatus.selectedItem.toString()

        val selectedPosition = binding.spinnerRole.selectedItemPosition
        if (selectedPosition < 0 || selectedPosition >= roleNames.size) {
            Toast.makeText(requireContext(), "Vui lòng chọn role", Toast.LENGTH_SHORT).show()
            return
        }

        val roleName = roleNames[selectedPosition]

        Log.d("UserFormFragment", """
        Creating user:
        - username: $username
        - email: $email  
        - password: ${password.length} chars
        - roleName: $roleName
        - status: $status
    """.trimIndent())

        binding.btnSaveUser.isEnabled = false
        binding.btnSaveUser.text = "Đang lưu..."
        binding.progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                viewModel.createUser(username, email, password, username, roleName)

                Toast.makeText(requireContext(), "Tạo user thành công!", Toast.LENGTH_SHORT).show()
                kotlinx.coroutines.delay(1500)
                findNavController().navigateUp()

            } catch (e: Exception) {
                Log.e("UserFormFragment", "Error creating user", e)

                val errorMsg = if (e.message?.contains("url") == true ||
                        e.message?.contains("image") == true) {
                    """
                Lỗi: Backend gặp vấn đề với hệ thống ảnh.
                Vui lòng báo admin backend:
                "null value in column 'url' of relation 'images'"
                """.trimIndent()
                } else {
                    "Lỗi tạo user: ${e.message}"
                }

                Toast.makeText(requireContext(), errorMsg, Toast.LENGTH_LONG).show()
                binding.btnSaveUser.isEnabled = true
                binding.btnSaveUser.text = "Lưu"
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    private fun updateUser() {
        val username = binding.edtUsername.text.toString().trim()
        val email = binding.edtEmail.text.toString().trim()
        val fullName = binding.edtFullName.text.toString().trim()
        val status = binding.spinnerStatus.selectedItem.toString()

        val selectedPosition = binding.spinnerRole.selectedItemPosition
        val roleId = if (selectedPosition >= 0 && selectedPosition < roleNames.size) {
            val roleName = roleNames[selectedPosition]
            roleNameToId[roleName]
        } else {
            null
        }

        Log.d("UserFormFragment", """
        Updating user $userId:
        - username: $username (readonly)
        - fullName: $fullName
        - email: $email  
        - roleId: $roleId
        - status: $status
    """.trimIndent())

        binding.btnSaveUser.isEnabled = false
        binding.btnSaveUser.text = "Đang cập nhật..."
        binding.progressBar.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                viewModel.updateUser(
                        id = userId,
                        fullName = fullName.ifEmpty { username },
                        email = email,
                        roleId = roleId,
                        status = status
                )

                Toast.makeText(requireContext(), "Cập nhật user thành công!", Toast.LENGTH_SHORT).show()
                kotlinx.coroutines.delay(1500)
                findNavController().navigateUp()

            } catch (e: Exception) {
                Log.e("UserFormFragment", "Error updating user", e)
                Toast.makeText(
                        requireContext(),
                        "Lỗi cập nhật user: ${e.message}",
                        Toast.LENGTH_LONG
                ).show()
                binding.btnSaveUser.isEnabled = true
                binding.btnSaveUser.text = "Cập nhật"
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
}