package com.example.admin.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.admin.databinding.ItemUserBinding
import com.example.admin.model.UserModel

class UserAdapter(
        private val onClick: (UserModel) -> Unit
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

        fun bind(user: UserModel) {
            binding.apply {
                tvUsername.text = "👤 ${user.username}"
                tvEmail.text = "📧 ${user.email}"
                tvRole.text = "🎭 ${user.role}"

                // Hiển thị status với màu sắc
                val statusText = when (user.status.uppercase()) {
                    "ACTIVE" -> "🟢 ACTIVE"
                    "INACTIVE" -> "🟡 INACTIVE"
                    "BANNED" -> "🔴 BANNED"
                    "DELETED" -> "⚫ DELETED"
                    else -> user.status
                }
                tvStatus.text = statusText

                // Hiển thị full name nếu có
                if (user.fullName.isNotEmpty()) {
                    tvFullName.text = "👨‍💼 ${user.fullName}"
                    tvFullName.visibility = View.VISIBLE
                } else {
                    tvFullName.visibility = View.GONE
                }

                root.setOnClickListener {
                    onClick(user)
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