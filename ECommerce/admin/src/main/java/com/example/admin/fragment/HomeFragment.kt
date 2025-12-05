package com.example.admin.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.admin.R
import com.example.admin.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupClickListeners()
        loadStatistics()
        setupRecyclerView()
    }

    private fun setupClickListeners() {
        // Thêm sản phẩm
        binding.cardAddProduct.setOnClickListener {
            // Điều hướng đến trang thêm sản phẩm
            findNavController().navigate(R.id.nav_products)
        }

        // Xem đơn hàng
        binding.cardViewOrders.setOnClickListener {
            // Điều hướng đến trang đơn hàng
            findNavController().navigate(R.id.nav_orders)
        }

        // Xem tất cả sản phẩm
        binding.tvViewAllProducts.setOnClickListener {
            findNavController().navigate(R.id.nav_products)
        }
    }

    private fun loadStatistics() {
        // TODO: Load dữ liệu thống kê từ API hoặc database
        binding.tvTodayProducts.text = "12"
        binding.tvTodayUsers.text = "5"
        binding.tvTodayOrders.text = "8"
        binding.tvTodayRevenue.text = "2.500.000đ"
    }

    private fun setupRecyclerView() {
        // TODO: Setup RecyclerView cho sản phẩm mới nhất
        // binding.recyclerNewProducts.adapter = ProductAdapter()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}