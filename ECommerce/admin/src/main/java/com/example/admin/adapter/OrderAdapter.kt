package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.databinding.ItemOrderBinding
import com.example.admin.helper.FormatHelper
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
                tvOrderId.text = "Mã đơn: #${order.id}"
                tvCustomerName.text = order.fullName ?: order.username ?: "Khách hàng"
                tvCustomerEmail.text = order.email ?: ""
                tvOrderDate.text = order.formattedDate
                tvOrderTotal.text = order.formattedPrice
                tvItemCount.text = "${order.itemCount} sản phẩm"

                // Status
                tvStatus.text = order.statusText
                tvStatus.setBackgroundColor(order.statusColor)

                // Status badge color
                val context = root.context
                tvStatus.setBackgroundColor(
                        context.resources.getColor(order.statusColor, context.theme)
                )

                // Set text color based on status
                val textColor = when (order.status.uppercase()) {
                    "DELETED" -> android.R.color.white
                    else -> android.R.color.black
                }
                tvStatus.setTextColor(
                        context.resources.getColor(textColor, context.theme)
                )
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