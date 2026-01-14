package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.admin.R
import com.example.admin.databinding.FragmentOrderListBinding

class OrderListFragment : Fragment(R.layout.fragment_order_list) {

    private var binding: FragmentOrderListBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentOrderListBinding.bind(view)
    }

    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}