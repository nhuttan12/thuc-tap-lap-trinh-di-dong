/**
 * @description Diff callback for pagination adapter, comparing old and new recycler view items,
 *              when items are the same, the adapter will not notify item range changed, if any
 *              of them is different, the adapter will notify item range changed.
 * @author @nhuttan12
 * @since 2026-01-16
 * @modifies 2026-01-16
 * @version 1.0.1
 */

package com.example.e_commerce.Mappers

import androidx.recyclerview.widget.DiffUtil

object DiffCallback : DiffUtil.ItemCallback<Int>() {
    override fun areItemsTheSame(oldItem: Int, newItem: Int): Boolean {
        return oldItem == newItem
    }

    override fun areContentsTheSame(oldItem: Int, newItem: Int): Boolean {
        return oldItem == newItem
    }
}