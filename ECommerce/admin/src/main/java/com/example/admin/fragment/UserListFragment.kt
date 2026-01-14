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

        // ✅ init repository
        repository = UserRepository(ApiService.userService)

        // ✅ init adapter (bắt buộc truyền onClick)
        adapter = UserAdapter { user ->
            Log.d("UserClick", "Click user id=${user.id}")
            // TODO: navigate sang màn chi tiết / edit
        }

        // ✅ setup RecyclerView
        binding.recyclerUsers.layoutManager =
                LinearLayoutManager(requireContext())
        binding.recyclerUsers.adapter = adapter

        // ✅ load data
        loadUsers()
    }

    private fun loadUsers() {
        lifecycleScope.launch {
            try {
                val users = repository.getUsers(page = 1, limit = 20)

                if (users.isNullOrEmpty()) {
                    Toast.makeText(
                            requireContext(),
                            "Danh sách user trống",
                            Toast.LENGTH_SHORT
                    ).show()
                    return@launch
                }

                adapter.submitList(users)

            } catch (e: Exception) {
                Log.e("UserListFragment", "Load users error", e)
                Toast.makeText(
                        requireContext(),
                        "Lỗi tải danh sách user",
                        Toast.LENGTH_SHORT
                ).show()
            }
        }
    }
}
