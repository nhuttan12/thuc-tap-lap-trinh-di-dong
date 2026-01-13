package com.example.e_commerce.Adapter

import android.app.Activity
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.request.RequestOptions
import com.example.e_commerce.Helper.CheckToken
import com.example.e_commerce.Model.Enum.ProductListType
import com.example.e_commerce.Model.ProductModel
import com.example.e_commerce.databinding.ViewholderProductCardBinding
import java.text.DecimalFormat

class PopularAdapter(
    private val activity: Activity,
    private val items: MutableList<ProductModel>,
    private val listType: ProductListType,
    private val checkToken: CheckToken,
    private val onItemClick: (ProductModel) -> Unit,
    private val onWishlistClick: ((ProductModel) -> Unit)? = null
) : RecyclerView.Adapter<PopularAdapter.ViewHolder>() {
    private val priceFormat: DecimalFormat = DecimalFormat("#,###.##")
    private val TAG = "PopularAdapter"

    fun updateDate(newData: List<ProductModel>) {
        items.clear()
        items.addAll(newData)
        notifyDataSetChanged()
    }

    fun currentItems(): List<ProductModel> = items

    inner class ViewHolder(val binding: ViewholderProductCardBinding) :
        RecyclerView.ViewHolder(binding.root) {

    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): PopularAdapter.ViewHolder {
        val binding = ViewholderProductCardBinding.inflate(
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

//            when (listType) {
//                ProductListType.WISHLIST -> {
                    val isInWishlist = item.isInWishlist

                    addToWishlist.isEnabled = true
                    addToWishlist.isSelected = false
                    addToWishlist.isActivated = isInWishlist

                    addToWishlist.setOnClickListener {
                        onWishlistClick?.invoke(item)
                    }

                    root.setOnClickListener {
                        onItemClick(item)
                    }
//                }

//                else -> {
//                    addToWishlist.isEnabled = true
//
//                    addToWishlist.setOnClickListener {
//                        checkToken.checkTokenOrRedirect(activity) {
//                            onWishlistClick?.invoke(item)
//                        }
//                    }
//
//                    root.setOnClickListener {
//                        onItemClick(item)
//                    }
//                }
//            }

            root.setOnClickListener {
                onItemClick(item)
            }
        }
    }

    override fun getItemCount(): Int = items.size

    fun removeItemById(productId: Int) {
        val index = items.indexOfFirst { it.id == productId }
        if (index != -1) {
            items.removeAt(index)
            notifyItemRemoved(index)
            notifyItemRangeChanged(index, items.size - index)
        }
    }
}