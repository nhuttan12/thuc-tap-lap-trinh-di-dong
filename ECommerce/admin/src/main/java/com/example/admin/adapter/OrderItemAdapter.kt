package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.R
import com.example.admin.model.OrderItemModel

class OrderItemAdapter : RecyclerView.Adapter<OrderItemAdapter.OrderItemViewHolder>() {

    private var items: List<OrderItemModel> = emptyList()

    fun submitList(newItems: List<OrderItemModel>) {
        items = newItems
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderItemViewHolder {
        val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_order_product, parent, false)
        return OrderItemViewHolder(view)
    }

    override fun onBindViewHolder(holder: OrderItemViewHolder, position: Int) {
        val item = items[position]
        holder.bind(item)
    }

    override fun getItemCount(): Int = items.size

    inner class OrderItemViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        private val tvProductName: TextView = itemView.findViewById(R.id.tvProductName)
        private val tvProductId: TextView = itemView.findViewById(R.id.tvProductId)
        private val tvQuantity: TextView = itemView.findViewById(R.id.tvQuantity)
        private val tvPrice: TextView = itemView.findViewById(R.id.tvPrice)
        private val tvTotal: TextView = itemView.findViewById(R.id.tvTotal)

        fun bind(item: OrderItemModel) {
            tvProductName.text = item.productName
            tvProductId.text = "Mã SP: ${item.productId ?: "N/A"}"
            tvQuantity.text = "Số lượng: ${item.quantity}"
            tvPrice.text = "Đơn giá: ${item.formattedPrice}"
            tvTotal.text = "Thành tiền: ${item.formattedTotal}"
        }
    }
}