package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.R
import com.example.admin.databinding.ItemProductBinding
import com.example.admin.model.Product

class ProductAdapter(
        private val onItemClick: (Product) -> Unit,
        private val onEditClick: (Product) -> Unit,
        private val onDeleteClick: (Product) -> Unit
) : ListAdapter<Product, ProductAdapter.ProductViewHolder>(DIFF_CALLBACK) {

    companion object {
        val DIFF_CALLBACK = object : DiffUtil.ItemCallback<Product>() {
            override fun areItemsTheSame(old: Product, new: Product): Boolean =
                    old.id == new.id

            override fun areContentsTheSame(old: Product, new: Product): Boolean =
                    old == new
        }
    }

    inner class ProductViewHolder(
            private val binding: ItemProductBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            // Set click listeners
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

            binding.root.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }
        }

        fun bind(product: Product) {
            binding.apply {
                tvProductName.text = product.name
                tvProductPrice.text = "Giá: ${product.price}đ"

                if (product.hasDiscount()) {
                    tvProductDiscount.text = "Giảm: ${product.discount}%"
                    tvProductDiscount.visibility = View.VISIBLE
                    tvFinalPrice.text = "Còn: ${product.getFinalPrice()}đ"
                    tvFinalPrice.visibility = View.VISIBLE
                } else {
                    tvProductDiscount.visibility = View.GONE
                    tvFinalPrice.visibility = View.GONE
                }

                // Status
                tvProductStatus.text = product.status
                val statusBackground = when (product.status.uppercase()) {
                    "ACTIVE" -> R.drawable.bg_status_active
                    "INACTIVE" -> R.drawable.bg_status_inactive
                    "DELETED" -> R.drawable.bg_status_banned
                    else -> R.drawable.bg_status_active
                }
                tvProductStatus.setBackgroundResource(statusBackground)

                // Category
                tvProductCategory.text = product.category

                // Ẩn nút xoá nếu sản phẩm đã bị xoá
                if (product.status.uppercase() == "DELETED") {
                    btnDelete.visibility = View.GONE
                } else {
                    btnDelete.visibility = View.VISIBLE
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val binding = ItemProductBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
        )
        return ProductViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}