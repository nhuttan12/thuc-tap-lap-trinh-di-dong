package com.example.e_commerce.Adapter

import android.graphics.PorterDuff
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.graphics.toColorInt
import androidx.recyclerview.widget.RecyclerView
import com.example.e_commerce.Helper.ColorConverter
import com.example.e_commerce.databinding.ViewholderColorBinding

class ColorAdapter(private val items: ArrayList<String>) :
    RecyclerView.Adapter<ColorAdapter.ViewHolder>() {
    private var selectedPosition = -1
    private var lastSelectedPosition = -1
    private val colorConverter: ColorConverter = ColorConverter()

    inner class ViewHolder(val binding: ViewholderColorBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ViewHolder {
        val binding =
            ViewholderColorBinding.inflate(
                LayoutInflater.from(parent.context), parent, false
            )

        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val adapterPosition: Int = holder.bindingAdapterPosition
        if (adapterPosition == RecyclerView.NO_POSITION) return

        val colorHex = this.colorConverter.convertColorNameToHex(items[adapterPosition])
        val color = colorHex.toColorInt()

        holder.binding.colorCircle.setColorFilter(color, PorterDuff.Mode.SRC_IN)
        holder.binding.strokeView.visibility =
            if (selectedPosition == adapterPosition) View.VISIBLE else View.GONE

        holder.binding.root.setOnClickListener {
            val pos = holder.bindingAdapterPosition
            if (pos == RecyclerView.NO_POSITION) return@setOnClickListener

            if (selectedPosition != pos) {
                lastSelectedPosition = selectedPosition
                selectedPosition = pos

                if (lastSelectedPosition != -1) notifyItemChanged(lastSelectedPosition)
                notifyItemChanged(selectedPosition)
            }
        }
    }

    override fun getItemCount(): Int = items.size

}