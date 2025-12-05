package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.admin.R
import com.example.admin.databinding.FragmentAdminDashboardBinding

class DashboardFragment : Fragment(R.layout.fragment_admin_dashboard) {

    private var binding: FragmentAdminDashboardBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentAdminDashboardBinding.bind(view)

        // Add onClick for cards if needed (temporarily empty for UI only)
        binding!!.cardAddProduct.setOnClickListener { /* Navigate to add product */ }
        binding!!.cardViewOrders.setOnClickListener { /* Navigate to orders */ }
    }

    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}