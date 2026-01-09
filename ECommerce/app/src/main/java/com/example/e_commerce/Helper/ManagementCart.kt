package com.example.e_commerce.Helper

import android.content.Context
import android.widget.Toast
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Model.ProductDetailModel

class ManagementCart(val context: Context) {

    private val tinyDB = TinyDB(context)

//    fun insert(item: ProductDetailModel) {
//        var listFood = getListCart()
//        val existAlready = listFood.any { it.title == item.title }
//        val index = listFood.indexOfFirst { it.title == item.title }
//
//        if (existAlready) {
//            listFood[index].numberInCart = item.numberInCart
//        } else {
//            listFood.add(item)
//        }
//        tinyDB.putListObject("CartList", listFood)
//        Toast.makeText(context, "Đã thêm sản phẩm vào giỏ hàng", Toast.LENGTH_SHORT).show()
//    }

    fun getListCart(): ArrayList<CartItemModel> {
        return tinyDB.getListObject("CartList")
    }

    fun minusItem(listFood: ArrayList<CartItemModel>, position: Int, listener: ChangeNumberItemsListener) {
        if (listFood[position].numberInCart == 1) {
            listFood.removeAt(position)
        } else {
            listFood[position].numberInCart--
        }
        tinyDB.putListObject("CartList", listFood)
        listener.onChanged()
    }

    fun plusItem(listFood: List<CartItemModel>, position: Int, listener: ChangeNumberItemsListener) {
        listFood[position].numberInCart++
        tinyDB.putListObject("CartList", listFood)
        listener.onChanged()
    }

    fun getTotalFee(): Double {
        val listFood = getListCart()
        var fee = 0.0
        for (item in listFood) {
            fee += item.price * item.numberInCart
        }
        return fee
    }
}