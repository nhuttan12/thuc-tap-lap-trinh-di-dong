package com.example.e_commerce.Adapter

import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.request.RequestOptions
import com.example.e_commerce.Activity.DetailActivity
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.R
import com.example.e_commerce.databinding.ViewholderRecommendedBinding
import java.text.DecimalFormat

class PopularAdapter(
    private val items: MutableList<ProductModel>,
    private val listType: ProductListType,
    private val onItemClick: (ProductModel) -> Unit,
    private val onWishlistClick: ((ProductModel) -> Unit)? = null
) : RecyclerView.Adapter<PopularAdapter.ViewHolder>() {
    private val priceFormat: DecimalFormat = DecimalFormat("#,###.##")

    fun updateDate(newData: List<ProductModel>) {
        items.clear()
        items.addAll(newData)
        notifyDataSetChanged()
    }

    fun currentItems(): List<ProductModel> = items

    inner class ViewHolder(val binding: ViewholderRecommendedBinding) :
        RecyclerView.ViewHolder(binding.root) {

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): PopularAdapter.ViewHolder {
        val binding = ViewholderRecommendedBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )

        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PopularAdapter.ViewHolder, position: Int) {
        val item = items[position]

        print("Item: $item")

        holder.binding.apply {
            titleTxt.text = item.title
            priceTxt.text = priceFormat.format(item.price)
            ratingTxt.text = item.rating.toString()

            Glide
                .with(root.context)
                .load(item.picUrl)
                .apply(
                    RequestOptions().transform(
                        CenterCrop()
                    )
                ).into(pic)

            when (listType) {
                ProductListType.WISHLIST -> {
                    addToWishlist.setColorFilter(
                        root.context.getColor(R.color.red)
                    )
                    addToWishlist.isEnabled = false
                }

                else -> {
                    addToWishlist.setColorFilter(
                        root.context.getColor(
                            if (item.isInWishlist) R.color.red else R.color.grey
                        )
                    )

                    addToWishlist.setOnClickListener {
                        onWishlistClick?.invoke(item)
                    }
                }
            }

            root.setOnClickListener {
                onItemClick(item)
            }
        }
    }

    override fun getItemCount(): Int = items.size
}