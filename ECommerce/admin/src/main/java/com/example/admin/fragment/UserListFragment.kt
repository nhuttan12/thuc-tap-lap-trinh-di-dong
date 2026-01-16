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
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.UserAdapter
import com.example.admin.databinding.FragmentUserListBinding
import com.example.admin.model.UserModel
import com.example.admin.repository.UserRepository
import com.example.admin.service.ApiService
import kotlinx.coroutines.launch
import java.io.Serializable

class UserListFragment : Fragment() {

    private lateinit var binding: FragmentUserListBinding
    private lateinit var adapter: UserAdapter
    private lateinit var repository: UserRepository

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        binding = FragmentUserListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Init repository
        repository = UserRepository(ApiService.userService)

        // Init adapter với click listener
        adapter = UserAdapter { user ->
            Log.d("UserClick", "Click user: ${user.username}, id=${user.id}")
            // Navigate to edit user form với preloaded data
            navigateToUserForm(true, user.id, user)
        }

        // Setup RecyclerView
        binding.recyclerUsers.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerUsers.adapter = adapter
        binding.recyclerUsers.setHasFixedSize(true)

        // Load data
        loadUsers()

        // Setup FAB - Navigate to create user form
        binding.fabAddUser.setOnClickListener {
            navigateToUserForm(false, 0, null)
        }

        // Setup search
        setupSearch()

        // Setup empty state và progress bar
        setupEmptyState()
    }

    private fun setupEmptyState() {
        // Kiểm tra nếu có progress bar và empty state trong layout
        if (binding.progressBar == null) {
            Log.w("UserListFragment", "ProgressBar not found in layout")
        }
        if (binding.tvEmptyState == null) {
            Log.w("UserListFragment", "tvEmptyState not found in layout")
        }
    }

    private fun navigateToUserForm(isEditMode: Boolean, userId: Int, user: UserModel?) {
        try {
            val bundle = Bundle().apply {
                putBoolean("isEditMode", isEditMode)
                putInt("userId", userId)

                // Truyền preloaded data nếu có user
                if (user != null) {
                    val preloadedData = mapOf(
                            "username" to user.username,
                            "email" to user.email,
                            "role" to user.role,
                            "status" to user.status
                    )
                    putSerializable("preloadedData", preloadedData as Serializable)
                }
            }

            // Navigate với Bundle
            findNavController().navigate(
                    R.id.action_userList_to_userForm,
                    bundle
            )
        } catch (e: Exception) {
            Log.e("UserListFragment", "Navigation error: ${e.message}", e)
            Toast.makeText(
                    requireContext(),
                    "Lỗi mở form user: ${e.message}",
                    Toast.LENGTH_SHORT
            ).show()
        }
    }

    private fun setupSearch() {
        // Kiểm tra nếu có search field trong layout
        if (binding.edtSearchUser != null) {
            binding.edtSearchUser.setOnEditorActionListener { _, _, _ ->
                val keyword = binding.edtSearchUser.text.toString().trim()
                searchUsers(keyword)
                true
            }
        } else {
            Log.w("UserListFragment", "Search field not found in layout")
        }
    }

    private fun searchUsers(keyword: String) {
        lifecycleScope.launch {
            try {
                showLoading(true)
                val users = repository.getUsers(keyword = keyword)

                if (users.isEmpty()) {
                    showEmptyState(true, "Không tìm thấy người dùng")
                } else {
                    showEmptyState(false)
                    adapter.submitList(users)
                }
                showLoading(false)

            } catch (e: Exception) {
                Log.e("UserListFragment", "Search error: ${e.message}", e)
                Toast.makeText(
                        requireContext(),
                        "Lỗi tìm kiếm: ${e.message}",
                        Toast.LENGTH_SHORT
                ).show()
                showLoading(false)
            }
        }
    }

    private fun loadUsers(page: Int = 1, limit: Int = 20) {
        lifecycleScope.launch {
            try {
                showLoading(true)
                Log.d("UserListFragment", "Loading users...")

                val users = repository.getUsers(page, limit)
                Log.d("UserListFragment", "Loaded ${users.size} users")

                if (users.isEmpty()) {
                    showEmptyState(true, "Danh sách người dùng trống")
                } else {
                    showEmptyState(false)
                    adapter.submitList(users)
                }

                showLoading(false)

            } catch (e: Exception) {
                Log.e("UserListFragment", "Load users error: ${e.message}", e)
                Toast.makeText(
                        requireContext(),
                        "Lỗi tải danh sách: ${e.message}",
                        Toast.LENGTH_LONG
                ).show()
                showEmptyState(true, "Lỗi tải danh sách")
                showLoading(false)
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        try {
            // Hiển thị/hide progress bar nếu có
            if (binding.progressBar != null) {
                binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            }

            // Ẩn recycler view khi loading
            binding.recyclerUsers.visibility = if (isLoading) View.GONE else View.VISIBLE
        } catch (e: Exception) {
            Log.e("UserListFragment", "Error showing loading state", e)
        }
    }

    private fun showEmptyState(show: Boolean, message: String? = null) {
        try {
            if (binding.tvEmptyState != null) {
                if (show) {
                    binding.tvEmptyState.visibility = View.VISIBLE
                    if (message != null) {
                        binding.tvEmptyState.text = message
                    }
                    binding.recyclerUsers.visibility = View.GONE
                } else {
                    binding.tvEmptyState.visibility = View.GONE
                    binding.recyclerUsers.visibility = View.VISIBLE
                }
            }
        } catch (e: Exception) {
            Log.e("UserListFragment", "Error showing empty state", e)
        }
    }

    override fun onResume() {
        super.onResume()
        // Refresh data khi quay lại fragment
        loadUsers()
    }
}