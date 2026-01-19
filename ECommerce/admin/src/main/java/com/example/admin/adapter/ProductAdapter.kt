
package com.example.admin.adapter

import android.graphics.Paint
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.admin.R
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

    inner class ProductViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        // Khai báo tất cả view bằng findViewById
        private val tvProductName: TextView = itemView.findViewById(R.id.tvProductName)
        private val tvBrand: TextView = itemView.findViewById(R.id.tvBrand)
        private val tvSizeColor: TextView = itemView.findViewById(R.id.tvSizeColor)
        private val tvRating: TextView = itemView.findViewById(R.id.tvRating)
        private val tvProductPrice: TextView = itemView.findViewById(R.id.tvProductPrice)
        private val tvProductDiscount: TextView = itemView.findViewById(R.id.tvProductDiscount)
        private val tvOriginalPrice: TextView = itemView.findViewById(R.id.tvOriginalPrice)
        private val tvFinalPrice: TextView = itemView.findViewById(R.id.tvFinalPrice)
        private val tvProductStatus: TextView = itemView.findViewById(R.id.tvProductStatus)
        private val tvProductCategory: TextView = itemView.findViewById(R.id.tvProductCategory)
        private val imgProduct: ImageView = itemView.findViewById(R.id.imgProduct)
        private val btnEdit: ImageButton = itemView.findViewById(R.id.btnEdit)
        private val btnDelete: ImageButton = itemView.findViewById(R.id.btnDelete)

        init {
            btnEdit.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onEditClick(getItem(position))
                }
            }

            btnDelete.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onDeleteClick(getItem(position))
                }
            }

            itemView.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }
        }

        fun bind(product: Product) {
            // Debug
            Log.d("ProductAdapter",
                    "Displaying: ${product.name} | " +
                            "Size: '${product.size}' | Color: '${product.color}'")

            // 1. Tên sản phẩm
            tvProductName.text = product.name

            // 2. Brand và Category
            val brandText = if (product.brand.isNotBlank()) product.brand else "Chưa có thương hiệu"
            tvBrand.text = brandText

            val categoryText = if (product.category.isNotBlank()) product.category else "Chưa có danh mục"
            tvProductCategory.text = categoryText

            // 3. Size & Color - parse từ string với delimiter ";"
            val sizeList = if (product.size.isNotBlank()) {
                product.size.split(";").map { it.trim() }.filter { it.isNotBlank() }
            } else {
                emptyList()
            }

            val colorList = if (product.color.isNotBlank()) {
                product.color.split(";").map { it.trim() }.filter { it.isNotBlank() }
            } else {
                emptyList()
            }

            val sizeColorText = buildString {
                if (sizeList.isNotEmpty()) {
                    append("Size: ${sizeList.joinToString(", ")}")
                }
                if (colorList.isNotEmpty()) {
                    if (sizeList.isNotEmpty()) append(" | ")
                    append("Màu: ${colorList.joinToString(", ")}")
                }
                if (isEmpty()) {
                    append("Chưa cập nhật")
                }
            }
            tvSizeColor.text = sizeColorText

            // 4. Rating
            if (product.rating > 0) {
                tvRating.text = "★ ${String.format("%.1f", product.rating)}"
                tvRating.visibility = View.VISIBLE
            } else {
                tvRating.visibility = View.GONE
            }

            // 5. Format giá
            val priceText = formatPrice(product.price)

            // 6. Giảm giá - SỬA: Kiểm tra discount > 0
            if (product.discount > 0) {
                val discountText = "-${product.discount.toInt()}%"
                tvProductDiscount.text = discountText
                tvProductDiscount.visibility = View.VISIBLE

                // Hiển thị giá gốc
                tvOriginalPrice.text = priceText
                tvOriginalPrice.visibility = View.VISIBLE
                tvOriginalPrice.paintFlags =
                        tvOriginalPrice.paintFlags or Paint.STRIKE_THRU_TEXT_FLAG

                // Hiển thị giá sau giảm
                val finalPriceText = formatPrice(product.getFinalPrice())
                tvFinalPrice.text = finalPriceText
                tvFinalPrice.visibility = View.VISIBLE

                // Ẩn giá thường
                tvProductPrice.visibility = View.GONE
            } else {
                tvProductDiscount.visibility = View.GONE
                tvOriginalPrice.visibility = View.GONE
                tvFinalPrice.visibility = View.GONE
                tvProductPrice.text = priceText
                tvProductPrice.visibility = View.VISIBLE
            }

            // 7. Status
            val (statusText, statusBgRes, statusTextColorRes) = when (product.status.uppercase()) {
                "ACTIVE" -> Triple("ĐANG BÁN", R.drawable.bg_status_active, R.color.white)
                "INACTIVE" -> Triple("NGỪNG BÁN", R.drawable.bg_role_chip, R.color.black)
                "DRAFT" -> Triple("BẢN NHÁP", R.drawable.bg_status_inactive, R.color.white)
                "DELETED" -> Triple("ĐÃ XÓA", R.drawable.bg_status_banned, R.color.white)
                else -> Triple(product.status, R.drawable.bg_status_active, R.color.white)
            }

            tvProductStatus.text = statusText
            tvProductStatus.setBackgroundResource(statusBgRes)
            tvProductStatus.setTextColor(ContextCompat.getColor(itemView.context, statusTextColorRes))

            // 8. HÌNH ẢNH
            if (product.imageUrl.isNotBlank() && product.imageUrl != "null") {
                Glide.with(itemView.context)
                        .load(product.imageUrl)
                        .placeholder(R.drawable.ic_product)
                        .error(R.drawable.ic_product)
                        .centerCrop()
                        .into(imgProduct)
            } else {
                imgProduct.setImageResource(R.drawable.ic_product)
            }

            // 9. Ẩn nút xoá nếu sản phẩm đã bị xoá
            if (product.status.uppercase() == "DELETED") {
                btnDelete.visibility = View.GONE
            } else {
                btnDelete.visibility = View.VISIBLE
            }
        }

        // THÊM CÁC HÀM PARSE MỚI
        private fun parseSizeList(sizeString: String): List<String> {
            if (sizeString.isBlank()) return emptyList()

            return when {
                // Database format: "39; 40; 41" hoặc "39;40;41"
                sizeString.contains(";") -> {
                    sizeString.split(";")
                            .map { it.trim() }
                            .filter { it.isNotBlank() }
                }
                // Có thể là format cũ: "39,40,41"
                sizeString.contains(",") -> {
                    sizeString.split(",")
                            .map { it.trim() }
                            .filter { it.isNotBlank() }
                }
                // Chỉ một giá trị
                else -> listOf(sizeString.trim())
            }
        }

        private fun parseColorList(colorString: String): List<String> {
            if (colorString.isBlank()) return emptyList()

            return when {
                // Database format: "Đỏ; Xanh; Đen" hoặc "Đỏ;Xanh;Đen"
                colorString.contains(";") -> {
                    colorString.split(";")
                            .map { it.trim() }
                            .filter { it.isNotBlank() }
                }
                // Có thể là format cũ: "Đỏ,Xanh,Đen"
                colorString.contains(",") -> {
                    colorString.split(",")
                            .map { it.trim() }
                            .filter { it.isNotBlank() }
                }
                // Chỉ một giá trị
                else -> listOf(colorString.trim())
            }
        }

        private fun formatPrice(price: Double): String {
            return try {
                val formatted = String.format("%,.0f", price)
                "$formatted VNĐ"
            } catch (e: Exception) {
                "${price.toInt()} VNĐ"
            }
        }
        }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductViewHolder {
        val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_product, parent, false)
        return ProductViewHolder(view)
    }

    override fun onBindViewHolder(holder: ProductViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}