package com.example.admin.adapter

import android.view.LayoutInflater
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
            binding.tvUsername.text = user.username
            binding.tvEmail.text = user.email
            binding.tvRole.text = user.role
            binding.tvStatus.text = user.status

            binding.root.setOnClickListener {
                onClick(user)
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
