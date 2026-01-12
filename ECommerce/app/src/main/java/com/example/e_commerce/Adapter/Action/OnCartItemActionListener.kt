package com.example.e_commerce.Adapter.Action

import com.example.e_commerce.Model.CartItemModel

interface OnCartItemActionListener {
    fun onIncrease(item: CartItemModel)
    fun onDecrease(item: CartItemModel)
}