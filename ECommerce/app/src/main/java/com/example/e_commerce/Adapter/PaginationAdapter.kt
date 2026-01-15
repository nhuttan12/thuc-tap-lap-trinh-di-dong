package com.example.e_commerce.Adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.e_commerce.databinding.ViewholderPaginationButtonBinding

class PaginationAdapter(
    private var totalPages: Int,
    private var currentPage: Int,
    private val onPageClick: (Int) -> Unit
) : RecyclerView.Adapter<PaginationAdapter.PageViewHolder>() {
    inner class PageViewHolder(
        val binding: ViewholderPaginationButtonBinding
    ) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PageViewHolder {
        val binding = ViewholderPaginationButtonBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )

        return PageViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PageViewHolder, position: Int) {
        val page = position + 1

        with(holder.binding) {
            pageBtn.text = page.toString()
            pageBtn.isSelected = page == currentPage
            pageBtn.setOnClickListener {
                if (page != currentPage) {
                    currentPage = page
                    notifyDataSetChanged()
                    onPageClick(page)
                }
            }
        }
    }

    override fun getItemCount(): Int {
        return totalPages
    }

    fun update(totalPages: Int, currentPage: Int) {
        this.totalPages = totalPages
        this.currentPage = currentPage
        notifyDataSetChanged()
    }
}