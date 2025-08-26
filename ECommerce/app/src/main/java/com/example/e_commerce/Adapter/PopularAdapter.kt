package com.example.e_commerce.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.request.RequestOptions
import com.example.e_commerce.Model.ItemModel
import com.example.e_commerce.databinding.ViewholderRecommendedBinding

class PopularAdapter(
    private val items: MutableList<ItemModel>
) : RecyclerView.Adapter<PopularAdapter.ViewHolder>() {
    fun updateDate(newData: List<ItemModel>) {
        items.clear()
        items.addAll(newData)
        notifyDataSetChanged()
    }

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
            priceTxt.text = item.price.toString()
            ratingTxt.text = item.rating.toString()

            Glide.with(holder.itemView.context).load(item.picUrl.firstOrNull()).apply(
                RequestOptions().transform(
                    CenterCrop()
                )
            ).into(pic)
        }
    }

    override fun getItemCount(): Int = items.size
}