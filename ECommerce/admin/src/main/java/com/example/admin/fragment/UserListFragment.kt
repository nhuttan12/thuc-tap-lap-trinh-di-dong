package com.example.admin.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.adapter.UserAdapter
import com.example.admin.databinding.FragmentUserListBinding
import com.example.admin.repository.UserRepository
import com.example.admin.service.ApiService
import kotlinx.coroutines.launch

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

        // Init adapter
        adapter = UserAdapter { user ->
            Log.d("UserClick", "Click user: ${user.username}, id=${user.id}")
            // TODO: Navigate to user detail/edit
            Toast.makeText(requireContext(), "Clicked: ${user.username}", Toast.LENGTH_SHORT).show()
        }

        // Setup RecyclerView
        binding.recyclerUsers.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerUsers.adapter = adapter
        binding.recyclerUsers.setHasFixedSize(true)

        // Load data
        loadUsers()

        // Setup FAB
        binding.fabAddUser.setOnClickListener {
            // TODO: Navigate to create user form
            Toast.makeText(requireContext(), "Add new user", Toast.LENGTH_SHORT).show()
        }

        // Setup search
        setupSearch()
    }

    private fun setupSearch() {
        binding.edtSearchUser.setOnEditorActionListener { _, _, _ ->
            val keyword = binding.edtSearchUser.text.toString().trim()
            searchUsers(keyword)
            true
        }
    }

    private fun searchUsers(keyword: String) {
        lifecycleScope.launch {
            try {
                showLoading(true)
                val users = repository.getUsers(keyword = keyword)

                if (users.isEmpty()) {
                    Toast.makeText(
                            requireContext(),
                            "Không tìm thấy người dùng",
                            Toast.LENGTH_SHORT
                    ).show()
                }

                adapter.submitList(users)
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
                    Toast.makeText(
                            requireContext(),
                            "Danh sách người dùng trống",
                            Toast.LENGTH_SHORT
                    ).show()
                    binding.recyclerUsers.visibility = View.GONE
                    // Hiển thị empty state nếu có
                } else {
                    binding.recyclerUsers.visibility = View.VISIBLE
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
                showLoading(false)
            }
        }
    }

    private fun showLoading(isLoading: Boolean) {
        // TODO: Hiển thị/hide progress bar
        if (isLoading) {
            // binding.progressBar.visibility = View.VISIBLE
            binding.recyclerUsers.visibility = View.GONE
        } else {
            // binding.progressBar.visibility = View.GONE
            binding.recyclerUsers.visibility = View.VISIBLE
        }
    }

    override fun onResume() {
        super.onResume()
        // Refresh data khi quay lại fragment
        loadUsers()
    }
}