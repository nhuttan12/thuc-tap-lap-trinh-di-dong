package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.admin.R
import com.example.admin.databinding.FragmentAdminDashboardBinding
class DashboardFragment : Fragment(R.layout.fragment_admin_dashboard) {
    private var _binding: FragmentAdminDashboardBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentAdminDashboardBinding.bind(view)

        // ✅ SỬA: Dùng ACTION ID thay vì Fragment ID
        binding.btnDetailedStats.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_analytics)
        }

        binding.cardAddProduct.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_products)
        }

        binding.cardViewOrders.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_orders)
        }

        binding.tvViewAllProducts.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_products)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
