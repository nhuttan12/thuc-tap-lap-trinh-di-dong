package com.example.e_commerce.Adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.CenterCrop
import com.bumptech.glide.request.RequestOptions
import com.example.e_commerce.Adapter.Action.OnCartItemActionListener
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.databinding.ViewholderCartBinding
import kotlin.math.roundToInt

class CartAdapter(
    private val listItemSelected: ArrayList<CartItemModel>,
    private val context: Context,
    private val listener: OnCartItemActionListener
) : RecyclerView.Adapter<CartAdapter.ViewHolder>() {

    class ViewHolder(val binding: ViewholderCartBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): CartAdapter.ViewHolder {
        val binding =
            ViewholderCartBinding.inflate(LayoutInflater.from(parent.context), parent, false)

        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CartAdapter.ViewHolder, position: Int) {
        val item = listItemSelected[position]

        holder.binding.titleTxt.text = item.title
        holder.binding.feeEachItemTxt.text = "${item.price}"
        holder.binding.totalEachItem.text = "${(item.numberInCart * item.price).roundToInt()}"
        holder.binding.numberItemTxt.text = item.numberInCart.toString()

        Glide.with(holder.itemView.context)
            .load(item.picUrl)
            .apply(
                RequestOptions().transform(
                    CenterCrop()
                )
            ).into(holder.binding.pic)

        holder.binding.plusCartBtn.setOnClickListener {
            val pos = holder.bindingAdapterPosition
            if (pos == RecyclerView.NO_POSITION) return@setOnClickListener
            listener.onIncrease(listItemSelected[pos])
        }

        holder.binding.minusCartBtn.setOnClickListener {
            val pos = holder.bindingAdapterPosition
            if (pos == RecyclerView.NO_POSITION) return@setOnClickListener
            listener.onDecrease(listItemSelected[pos])
        }
    }

    override fun getItemCount(): Int = listItemSelected.size

    fun updateData(newList: List<CartItemModel>) {
        this.listItemSelected.clear()
        this.listItemSelected.addAll(newList)
        notifyDataSetChanged()
    }

}