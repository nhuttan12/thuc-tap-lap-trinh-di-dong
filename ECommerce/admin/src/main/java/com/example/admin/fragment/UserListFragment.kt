package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.admin.R
import com.example.admin.databinding.FragmentUserListBinding

class UserListFragment : Fragment(R.layout.fragment_user_list) {

    private var binding: FragmentUserListBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentUserListBinding.bind(view)
    }

    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}