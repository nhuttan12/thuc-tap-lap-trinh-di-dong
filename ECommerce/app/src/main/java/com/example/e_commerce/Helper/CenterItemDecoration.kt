package com.example.e_commerce.Helper

import android.graphics.Rect
import android.view.View
import androidx.recyclerview.widget.RecyclerView

class CenterItemDecoration(
    private val itemWidth: Int,
    private val maxCenterItem: Int = 6
) : RecyclerView.ItemDecoration() {
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        val itemCount = state.itemCount

        if (itemCount >= maxCenterItem) return

//        if (position != 0) return
//
//        val parentWidth = parent.width
//        val totalItemsWidth = itemCount * itemWidth
//
//        if (totalItemsWidth < parentWidth) {
//            val padding = (parentWidth - totalItemsWidth) / 2
//            outRect.left = padding
//        }

        val parentWidth = parent.width
        if (parentWidth == 0) return

        val totalItemsWidth = itemCount * itemWidth
        if (totalItemsWidth >= parentWidth) return

        val padding = (parentWidth - totalItemsWidth) / 2

        when (position) {
            0 -> outRect.left = padding
            itemCount - 1 -> outRect.right = padding
        }
    }
}