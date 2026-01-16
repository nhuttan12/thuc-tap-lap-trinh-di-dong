package com.example.e_commerce.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.e_commerce.Model.PageItem
import com.example.e_commerce.R
import com.example.e_commerce.databinding.ViewholderPaginationButtonBinding

class PaginationAdapter(
    private val onPageClick: (Int) -> Unit
) : RecyclerView.Adapter<PaginationAdapter.PageViewHolder>() {
    private val items = mutableListOf<PageItem>()

    fun submit(itemsNew: List<PageItem>) {
        items.clear()
        items.addAll(itemsNew)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): PaginationAdapter.PageViewHolder {
        val binding = ViewholderPaginationButtonBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return PageViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PageViewHolder, position: Int) {
        holder.bind(items[position], onPageClick)
    }

    override fun getItemCount(): Int = items.size

    inner class PageViewHolder(
        private val binding: ViewholderPaginationButtonBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(item: PageItem, onClick: (Int) -> Unit) {
            val btn = binding.pageBtn

            when (item) {
                PageItem.Prev -> {
                    btn.setText(R.string.decreaseNumber)
                    btn.isSelected = false
                    btn.setOnClickListener {
                        onClick(-1)
                    }
                }

                PageItem.Next -> {
                    btn.setText(R.string.increaseNumber)
                    btn.isSelected = false
                    btn.setOnClickListener {
                        onClick(-2)
                    }
                }

                is PageItem.Page -> {
                    btn.text = item.page.toString()
                    btn.isSelected = item.isCurrent
                    btn.setOnClickListener {
                        onClick(item.page)
                    }
                }

                is PageItem.Last -> {
                    btn.text = item.page.toString()
                    btn.isSelected = false
                    btn.setOnClickListener {
                        onClick(item.page)
                    }
                }
            }
        }
    }
}