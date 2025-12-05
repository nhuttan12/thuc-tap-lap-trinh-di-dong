package com.example.admin.fragment

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.admin.R
import com.example.admin.databinding.FragmentAdminDashboardBinding
import androidx.navigation.fragment.findNavController

class DashboardFragment : Fragment(R.layout.fragment_admin_dashboard) {

    private var binding: FragmentAdminDashboardBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding = FragmentAdminDashboardBinding.bind(view)


        // Dùng action ID thay vì fragment ID
        binding!!.btnDetailedStats.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_analytics)

        }

        //  các navigation khác
        binding!!.cardAddProduct.setOnClickListener {
            findNavController().navigate(R.id.productListFragment)
        }

        binding!!.cardViewOrders.setOnClickListener {
            findNavController().navigate(R.id.orderListFragment)
        }

        // View All Products
        binding!!.tvViewAllProducts.setOnClickListener {
            findNavController().navigate(R.id.productListFragment)
        }
    }

    override fun onDestroyView() {
        binding = null
        super.onDestroyView()
    }
}