package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.databinding.ItemSelectedProductBinding

class SelectedProductAdapter(
        private val onRemoveClick: (Int) -> Unit,
        private val onQuantityChange: (Int, Int) -> Unit
) : ListAdapter<SelectedProductAdapter.SelectedProductItem, SelectedProductAdapter.ViewHolder>(SelectedProductDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemSelectedProductBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        holder.bind(item)
    }

    inner class ViewHolder(
            private val binding: ItemSelectedProductBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.btnRemove.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onRemoveClick(getItem(position).id)
                }
            }

            binding.btnIncrease.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    val item = getItem(position)
                    onQuantityChange(item.id, item.quantity + 1)
                }
            }

            binding.btnDecrease.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    val item = getItem(position)
                    if (item.quantity > 1) {
                        onQuantityChange(item.id, item.quantity - 1)
                    } else {
                        onRemoveClick(item.id)
                    }
                }
            }
        }

        fun bind(item: SelectedProductItem) {
            binding.apply {
                tvProductName.text = item.name
                tvProductPrice.text = "$${item.price}"
                tvQuantity.text = item.quantity.toString()
                tvTotal.text = "Tổng: $${item.total}"
            }
        }
    }

    class SelectedProductDiffCallback : DiffUtil.ItemCallback<SelectedProductItem>() {
        override fun areItemsTheSame(oldItem: SelectedProductItem, newItem: SelectedProductItem): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: SelectedProductItem, newItem: SelectedProductItem): Boolean {
            return oldItem == newItem
        }
    }

    data class SelectedProductItem(
            val id: Int,
            val name: String,
            val price: Int,
            val quantity: Int,
            val total: Int
    )
}