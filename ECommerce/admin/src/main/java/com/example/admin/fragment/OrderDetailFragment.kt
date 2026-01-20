package com.example.admin.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.admin.R
import com.example.admin.adapter.OrderItemAdapter
import com.example.admin.databinding.FragmentOrderDetailBinding
import com.example.admin.viewmodel.OrderViewModel

class OrderDetailFragment : Fragment() {

    private var _binding: FragmentOrderDetailBinding? = null
    private val binding get() = _binding!!

    private lateinit var viewModel: OrderViewModel
    private lateinit var orderItemAdapter: OrderItemAdapter

    private var orderId: Int = 0

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOrderDetailBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Lấy orderId từ arguments
        orderId = arguments?.getInt("orderId", 0) ?: 0

        setupViewModel()
        setupUI()
        setupObservers()
        loadOrderDetail()
    }

    private fun setupViewModel() {
        viewModel = ViewModelProvider(this)[OrderViewModel::class.java]
    }

    private fun setupUI() {
        // Setup back button
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }

        // Setup edit button
        binding.btnEdit.setOnClickListener {
            openOrderForm(orderId)
        }

        // Setup status change buttons
        // Setup status change buttons - CHỈ DÙNG CÁC STATUS HỢP LỆ
        binding.btnMarkPending.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "PENDING")
        }

        binding.btnMarkConfirmed.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "CONFIRMED")
        }

        binding.btnMarkProcessing.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "PROCESSING")
        }

        binding.btnMarkCompleted.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "COMPLETED")
        }

        binding.btnMarkCanceled.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "CANCELED") // 1 chữ L
        }

        binding.btnMarkOnHold.setOnClickListener {
            viewModel.updateOrderStatus(orderId, "ON_HOLD")
        }

        // Setup order items recyclerview
        orderItemAdapter = OrderItemAdapter()
        binding.recyclerOrderItems.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerOrderItems.adapter = orderItemAdapter
    }

    private fun setupObservers() {
        viewModel.orderDetail.observe(viewLifecycleOwner) { order ->
            order?.let {
                updateUI(order)
            }
        }

        viewModel.loading.observe(viewLifecycleOwner) { isLoading ->
            if (isLoading) {
                binding.progressBar.visibility = View.VISIBLE
            } else {
                binding.progressBar.visibility = View.GONE
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
                viewModel.clearError()
            }
        }
    }

    private fun loadOrderDetail() {
        if (orderId > 0) {
            viewModel.getOrderDetail(orderId)
        } else {
            Toast.makeText(requireContext(), "Không tìm thấy đơn hàng", Toast.LENGTH_SHORT).show()
            findNavController().navigateUp()
        }
    }

    private fun updateUI(order: com.example.admin.model.OrderModel) {
        binding.apply {
            tvOrderId.text = "Mã đơn: #${order.id}"
            tvCustomerName.text = "Khách hàng: ${order.fullName ?: order.username ?: "N/A"}"
            tvCustomerEmail.text = "Email: ${order.email ?: "N/A"}"
            tvOrderDate.text = "Ngày đặt: ${order.formattedDate}"
            tvItemSummary.text = "Sản phẩm: ${order.items.size} mặt hàng"
            tvOrderTotal.text = order.formattedPrice

            // Hiển thị status với màu và text phù hợp
            tvStatus.text = order.statusText
            tvStatus.setBackgroundResource(when (order.status) {
                "PENDING" -> R.drawable.bg_status_pending
                "CONFIRMED" -> R.drawable.bg_status_confirmed
                "PROCESSING" -> R.drawable.bg_status_processing
                "COMPLETED" -> R.drawable.bg_status_completed
                "CANCELED" -> R.drawable.bg_status_canceled
                "ON_HOLD" -> R.drawable.bg_status_on_hold
                else -> R.drawable.bg_status_default
            })

            // Update order items
            orderItemAdapter.submitList(order.items)
        }
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