package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.admin.model.Product
import com.example.admin.R
import com.example.admin.helper.FormatHelper
class ProductAdapter : ListAdapter<Product, ProductAdapter.ProductViewHolder>(ProductDiffCallback()) {

    var onItemClick: ((Product) -> Unit)? = null
    var onDeleteClick: ((Product) -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    inner class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val ivProductImage: ImageView = itemView.findViewById(R.id.ivProductImage)
        private val tvProductName: TextView = itemView.findViewById(R.id.productNameTextView)
        private val tvProductBrand: TextView = itemView.findViewById(R.id.productBrandTextView)
        private val tvProductPrice: TextView = itemView.findViewById(R.id.productPriceTextView)
        private val tvOldPrice: TextView = itemView.findViewById(R.id.productOldPriceTextView)
        private val btnEdit: View = itemView.findViewById(R.id.editButton)
        private val btnDelete: View = itemView.findViewById(R.id.deleteButton)

        fun bind(product: Product) {
            // Load ảnh
            if (product.imageUrl.isNotEmpty()) {
                Glide.with(itemView.context)
                        .load(product.imageUrl)
                        .placeholder(R.drawable.ic_product)
                        .error(R.drawable.ic_product)
                        .into(ivProductImage)
            }

            // Thông tin
            tvProductName.text = product.name
            tvProductBrand.text = product.category

            // Giá
            val finalPrice = product.getFinalPrice()
            tvProductPrice.text = FormatHelper.formatCurrency(finalPrice)

            if (product.discount > 0) {
                tvOldPrice.visibility = View.VISIBLE
                tvOldPrice.text = FormatHelper.formatCurrency(product.price)
                tvOldPrice.paintFlags = tvOldPrice.paintFlags or android.graphics.Paint.STRIKE_THRU_TEXT_FLAG
            } else {
                tvOldPrice.visibility = View.GONE
            }

            // Click events
            btnEdit.setOnClickListener {
                onItemClick?.invoke(product)
            }

            btnDelete.setOnClickListener {
                onDeleteClick?.invoke(product)
            }

            itemView.setOnClickListener {
                onItemClick?.invoke(product)
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