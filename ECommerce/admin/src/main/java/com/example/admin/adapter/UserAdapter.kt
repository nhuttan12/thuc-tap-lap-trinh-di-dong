package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.R
import com.example.admin.databinding.ItemUserBinding
import com.example.admin.model.UserModel

class UserAdapter(
        private val onItemClick: (UserModel) -> Unit,
        private val onEditClick: (UserModel) -> Unit,
        private val onDeleteClick: (UserModel) -> Unit  // ĐƠN GIẢN: chỉ 1 callback
) : ListAdapter<UserModel, UserAdapter.UserViewHolder>(DIFF_CALLBACK) {

    companion object {
        val DIFF_CALLBACK = object : DiffUtil.ItemCallback<UserModel>() {
            override fun areItemsTheSame(old: UserModel, new: UserModel): Boolean =
                    old.id == new.id

            override fun areContentsTheSame(old: UserModel, new: UserModel): Boolean =
                    old == new
        }
    }

    inner class UserViewHolder(
            private val binding: ItemUserBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        init {
            // Set click listeners
            binding.btnEdit.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onEditClick(getItem(position))
                }
            }

            binding.btnDelete.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onDeleteClick(getItem(position))
                }
            }

            binding.root.setOnClickListener {
                val position = bindingAdapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    onItemClick(getItem(position))
                }
            }
        }

        fun bind(user: UserModel) {
            binding.apply {
                tvUsername.text = user.username
                tvEmail.text = user.email
                tvRole.text = user.role.uppercase()

                // Set status với màu background
                tvStatus.text = user.status
                val statusBackground = when (user.status.uppercase()) {
                    "ACTIVE" -> R.drawable.bg_status_active
                    "INACTIVE" -> R.drawable.bg_status_inactive
                    "BANNED" -> R.drawable.bg_status_banned
                    else -> R.drawable.bg_status_active
                }
                tvStatus.setBackgroundResource(statusBackground)

                // Hiển thị full name nếu có
                if (user.fullName.isNotEmpty()) {
                    tvFullName.text = user.fullName
                    tvFullName.visibility = View.VISIBLE
                } else {
                    tvFullName.visibility = View.GONE
                }

                // Ẩn nút xoá nếu user đã bị xoá
                if (user.status.uppercase() == "DELETED") {
                    btnDelete.visibility = View.GONE
                } else {
                    btnDelete.visibility = View.VISIBLE
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemUserBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
        )
        return UserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
}