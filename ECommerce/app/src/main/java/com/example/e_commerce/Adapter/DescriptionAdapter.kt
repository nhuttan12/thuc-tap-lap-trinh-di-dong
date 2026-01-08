package com.example.e_commerce.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.e_commerce.databinding.ViewholderDescriptionBinding

class DescriptionAdapter(
    private val items: List<String>
) : RecyclerView.Adapter<DescriptionAdapter.ViewHolder>() {
    inner class ViewHolder(val binding: ViewholderDescriptionBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {
        val binding = ViewholderDescriptionBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )

        return ViewHolder(binding)
    }

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int
    ) {
        val item = items[position]
        holder.binding.descriptionTxt.text = item
    }

    override fun getItemCount(): Int = items.size
}