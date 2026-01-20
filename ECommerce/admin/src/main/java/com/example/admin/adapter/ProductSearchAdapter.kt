package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.databinding.ItemProductSearchBinding
import com.example.admin.model.Product

class ProductSearchAdapter(
        private val onAddClick: (Product) -> Unit
) : ListAdapter<Product, ProductSearchAdapter.ProductViewHolder>(ProductDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductSearchBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
        )
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        val product = getItem(position)
        holder.bind(product)
    }

    inner class ProductViewHolder(
            private val binding: ItemProductSearchBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            binding.btnAdd.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onAddClick(getItem(position))
                }
            }
        }

        fun bind(product: Product) {
            binding.apply {
                tvProductName.text = product.name
                tvProductPrice.text = "$${product.price}"

                // Hiển thị size và color
                val details = mutableListOf<String>()
                if (product.size.isNotEmpty()) {
                    details.add("Size: ${product.size}")
                }
                if (product.color.isNotEmpty()) {
                    details.add("Màu: ${product.color}")
                }
                tvProductDetails.text = details.joinToString(" • ")
            }
        }
    }

    class ProductDiffCallback : DiffUtil.ItemCallback<Product>() {
        override fun areItemsTheSame(oldItem: Product, newItem: Product): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Product, newItem: Product): Boolean {
            return oldItem == newItem
        }
    }
}