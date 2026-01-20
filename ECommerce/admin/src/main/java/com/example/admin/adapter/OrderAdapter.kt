package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.databinding.ItemOrderBinding
import com.example.admin.model.OrderModel

class OrderAdapter(
        private val onItemClick: (OrderModel) -> Unit,
        private val onEditClick: (OrderModel) -> Unit,
        private val onDeleteClick: (OrderModel) -> Unit
) : ListAdapter<OrderModel, OrderAdapter.OrderViewHolder>(OrderDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val binding = ItemOrderBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
        )
        return OrderViewHolder(binding)
    }

    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        val order = getItem(position)
        holder.bind(order)
    }

    inner class OrderViewHolder(
            private val binding: ItemOrderBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.root.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }

            binding.btnEdit.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onEditClick(getItem(position))
                }
            }

            binding.btnDelete.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onDeleteClick(getItem(position))
                }
            }
        }

        fun bind(order: OrderModel) {
            binding.apply {
                tvOrderId.text = "Đơn hàng #${order.id}"
                tvCustomerName.text = order.fullName ?: order.username ?: "Khách hàng"
                tvCustomerEmail.text = order.email ?: ""
                tvOrderDate.text = order.formattedDate
                tvOrderTotal.text = order.formattedPrice
                tvItemCount.text = "${order.itemCount} sản phẩm"

                // Status display
                tvStatus.text = order.statusText

                // Set status background
                tvStatus.setBackgroundResource(order.statusBackground)

                // Set status text color (luôn là màu trắng cho dễ đọc)
                tvStatus.setTextColor(ContextCompat.getColor(itemView.context, android.R.color.white))

                // Enable/disable buttons based on order status
                btnEdit.isEnabled = order.isEditable
                btnEdit.alpha = if (order.isEditable) 1.0f else 0.5f

                btnDelete.isEnabled = order.isCancelable
                btnDelete.alpha = if (order.isCancelable) 1.0f else 0.5f

                // Set delete button text based on status
                btnDelete.text = if (order.status.uppercase() == "DELETED") "Đã xóa" else "Xóa"
            }
        }
    }

    class OrderDiffCallback : DiffUtil.ItemCallback<OrderModel>() {
        override fun areItemsTheSame(oldItem: OrderModel, newItem: OrderModel): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: OrderModel, newItem: OrderModel): Boolean {
            return oldItem == newItem
        }
    }
}