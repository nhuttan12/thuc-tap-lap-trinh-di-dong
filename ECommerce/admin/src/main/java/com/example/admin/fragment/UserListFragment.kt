package com.example.admin.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.UserAdapter
import com.example.admin.databinding.FragmentUserListBinding
import com.example.admin.model.UserModel
import com.example.admin.repository.UserRepository
import com.example.admin.service.ApiService
import com.example.admin.viewmodel.UserViewModel
import java.io.Serializable

class UserListFragment : Fragment() {

    private lateinit var binding: FragmentUserListBinding
    private lateinit var adapter: UserAdapter
    private lateinit var repository: UserRepository
    private lateinit var viewModel: UserViewModel  // THÊM ViewModel

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

        // Init repository và ViewModel
        repository = UserRepository(ApiService.userService)
        viewModel = UserViewModel()  // KHỞI TẠO ViewModel

        //Setup ViewModel observers
        setupViewModelObservers()

        // Init adapter với 3 callbacks
        adapter = UserAdapter(
                onItemClick = { user ->
                    Log.d("UserClick", "Item click: ${user.username}, id=${user.id}")
                    navigateToUserForm(true, user.id, user)
                },
                onEditClick = { user ->  // THÊM callback edit
                    Log.d("UserClick", "Edit click: ${user.username}")
                    navigateToUserForm(true, user.id, user)
                },
                onDeleteClick = { user ->  // THÊM callback delete
                    Log.d("UserClick", "Delete click: ${user.username}")
                    showDeleteDialog(user)
                }
        )

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

    private fun setupViewModelObservers() {
        // Quan sát loading state
        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            showLoading(isLoading)
        }

        // Quan sát error state
        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
            }
        }

        // Quan sát users list
        viewModel.users.observe(viewLifecycleOwner) { users ->
            if (users.isEmpty()) {
                showEmptyState(true, "Danh sách người dùng trống")
            } else {
                showEmptyState(false)
                adapter.submitList(users)
            }
        }
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
                            "fullName" to user.fullName,
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
        viewModel.searchUsers(keyword)
    }

    private fun loadUsers(page: Int = 1, limit: Int = 20) {
        viewModel.loadUsers(page, limit)
    }

    // THÊM: Hàm hiển thị dialog xác nhận xoá
    private fun showDeleteDialog(user: UserModel) {
        AlertDialog.Builder(requireContext())
                .setTitle("Xác nhận xoá")
                .setMessage("Bạn có chắc muốn xoá người dùng:\n${user.username} (${user.email})?")
                .setPositiveButton("Xoá") { dialog, _ ->
                    deleteUser(user.id)
                    dialog.dismiss()
                }
                .setNegativeButton("Huỷ") { dialog, _ ->
                    dialog.dismiss()
                }
                .show()
    }

    // THÊM: Hàm xoá user
    private fun deleteUser(userId: Int) {
        viewModel.deleteUser(userId)
    }

    private fun showLoading(isLoading: Boolean) {
        try {
            // Hiển thị/hide progress bar nếu có
            if (binding.progressBar != null) {
                binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            }

            // Ẩn recycler view khi loading
            if (isLoading) {
                binding.recyclerUsers.visibility = View.GONE
            } else {
                binding.recyclerUsers.visibility = View.VISIBLE
            }
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