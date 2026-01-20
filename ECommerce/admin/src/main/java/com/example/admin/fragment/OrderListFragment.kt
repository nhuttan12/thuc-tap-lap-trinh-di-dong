package com.example.admin.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.OrderAdapter
import com.example.admin.databinding.FragmentOrderListBinding
import com.example.admin.viewmodel.OrderViewModel

class OrderListFragment : Fragment() {

    private var _binding: FragmentOrderListBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: OrderViewModel
    private lateinit var adapter: OrderAdapter

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOrderListBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupViewModel()
        setupUI()
        setupObservers()
        loadOrders()
    }

    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[OrderViewModel::class.java]
    }

    private fun setupUI() {
        // Setup RecyclerView
        adapter = OrderAdapter(
                onItemClick = { order ->
                    openOrderDetail(order.id)
                },
                onEditClick = { order ->
                    openOrderForm(order.id)
                },
                onDeleteClick = { order ->
                    showDeleteDialog(order)
                }
        )

        binding.recyclerOrders.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerOrders.adapter = adapter

        // Setup filter dropdown
        setupFilterDropdown()

        // Setup search
        binding.edtSearch.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH) {
                performSearch()
                true
            } else {
                false
            }
        }

        // Setup FAB
        binding.fabAddOrder.setOnClickListener {
            openOrderForm(0) // 0 = tạo mới
        }

        // Setup date filter button (tạm thời chưa implement)
        binding.btnFilterDate.setOnClickListener {
            Toast.makeText(requireContext(), "Chức năng lọc theo ngày đang phát triển", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupFilterDropdown() {
        val statuses = listOf(
                "Tất cả",
                "Đang xử lý (ACTIVE)",
                "Hoàn thành (COMPLETED)",
                "Đang giao (SHIPPING)",
                "Đã hủy (INACTIVE)",
                "Đã xóa (DELETED)"
        )

        val adapter = ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                statuses
        )

        binding.autoCompleteStatus.setAdapter(adapter)
        binding.autoCompleteStatus.setText("Tất cả", false)

        binding.autoCompleteStatus.setOnItemClickListener { _, _, position, _ ->
            val selectedStatus = when (position) {
                0 -> null
                1 -> "ACTIVE"
                2 -> "COMPLETED"
                3 -> "SHIPPING"
                4 -> "INACTIVE"
                5 -> "DELETED"
                else -> null
            }
            viewModel.loadOrders(status = selectedStatus)
        }
    }

    private fun setupObservers() {
        viewModel.orders.observe(viewLifecycleOwner) { orders ->
            adapter.submitList(orders)

            // Cập nhật số lượng đơn hàng
            binding.tvOrderCount.text = "Tổng: ${orders.size} đơn hàng"

            if (orders.isEmpty()) {
                binding.tvEmpty.visibility = View.VISIBLE
                binding.recyclerOrders.visibility = View.GONE
            } else {
                binding.tvEmpty.visibility = View.GONE
                binding.recyclerOrders.visibility = View.VISIBLE
            }
        }

        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (isLoading) {
                binding.progressBar.visibility = View.VISIBLE
                binding.recyclerOrders.visibility = View.GONE
                binding.tvEmpty.visibility = View.GONE
            } else {
                binding.progressBar.visibility = View.GONE
                // Hiển thị recycler nếu có data
                if (adapter.itemCount > 0) {
                    binding.recyclerOrders.visibility = View.VISIBLE
                } else {
                    binding.tvEmpty.visibility = View.VISIBLE
                }
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
                viewModel.clearError()
            }
        }
    }

    private fun loadOrders() {
        viewModel.loadOrders()
    }

    private fun performSearch() {
        val keyword = binding.edtSearch.text.toString().trim()
        if (keyword.isNotEmpty()) {
            // Filter locally
            val filtered = viewModel.orders.value?.filter { order ->
                order.id.toString().contains(keyword) ||
                        order.username?.contains(keyword, true) == true ||
                        order.fullName?.contains(keyword, true) == true ||
                        order.email?.contains(keyword, true) == true
            } ?: emptyList()

            adapter.submitList(filtered)

            // Update UI
            if (filtered.isEmpty()) {
                binding.tvEmpty.visibility = View.VISIBLE
                binding.tvEmpty.text = "Không tìm thấy đơn hàng"
                binding.recyclerOrders.visibility = View.GONE
            } else {
                binding.tvEmpty.visibility = View.GONE
                binding.recyclerOrders.visibility = View.VISIBLE
            }

            // Update count
            binding.tvOrderCount.text = "Tìm thấy: ${filtered.size} đơn hàng"
        } else {
            loadOrders()
        }
    }

    private fun showDeleteDialog(order: com.example.admin.model.OrderModel) {
        androidx.appcompat.app.AlertDialog.Builder(requireContext())
                .setTitle("Xác nhận xóa")
                .setMessage("Bạn có chắc chắn muốn xóa đơn hàng #${order.id}?\nĐơn hàng sẽ được chuyển sang trạng thái 'Đã xóa'.")
                .setPositiveButton("Xóa") { dialog, _ ->
                    viewModel.deleteOrder(order.id)
                    dialog.dismiss()
                }
                .setNegativeButton("Hủy", null)
                .show()
    }

    private fun openOrderDetail(orderId: Int) {
        val bundle = bundleOf("orderId" to orderId)
        findNavController().navigate(R.id.orderDetailFragment, bundle)
    }

    private fun openOrderForm(orderId: Int) {
        val bundle = bundleOf("orderId" to orderId)
        findNavController().navigate(R.id.orderFormFragment, bundle)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}