package com.example.e_commerce.Activity

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.databinding.ActivityCheckoutBinding
import com.example.e_commerce.Adapter.CartAdapter
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Adapter.Action.OnCartItemActionListener

class CheckoutActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCheckoutBinding
    private lateinit var tinyDB: TinyDB

    private lateinit var cartAdapter : CartAdapter


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        try {
            binding = ActivityCheckoutBinding.inflate(layoutInflater)
            setContentView(binding.root)

            tinyDB = TinyDB(this)
            cartAdapter = CartAdapter(
                arrayListOf(),
                this,
                object : OnCartItemActionListener {

                    override fun onIncrease(item: CartItemModel) {
                        val newQty = item.numberInCart + 1
                        item.numberInCart = newQty

                        cartAdapter.notifyDataSetChanged()
                        calculateTotal()

                        updateQuantity(item.id, newQty)
                    }

                    override fun onDecrease(item: CartItemModel) {
                        if (item.numberInCart <= 1) return

                        val newQty = item.numberInCart - 1
                        item.numberInCart = newQty

                        cartAdapter.notifyDataSetChanged()
                        calculateTotal()

                        updateQuantity(item.id, newQty)
                    }
                }
            )

            setupRecyclerView()
            loadCartData()
            loadUserProfile()

        } catch (e: Exception) {
            e.printStackTrace()
        }

    }
    private fun setupRecyclerView() {
        binding.rvProducts.layoutManager = LinearLayoutManager(this)
        binding.rvProducts.adapter = cartAdapter
    }

    private fun loadCartData() {
        val token = tinyDB.getValidToken() ?: return

        val url = "http://10.0.2.2:8080/checkout"

        val request = object : JsonObjectRequest(
            Request.Method.GET,
            url,
            null,
            { response ->
                val items = response.getJSONArray("data")

                val cartList = ArrayList<CartItemModel>()

                for (i in 0 until items.length()) {
                    val item = items.getJSONObject(i)

                    cartList.add(
                        CartItemModel(
                            id = item.getInt("cartDetailId"),
                            title = item.getString("name"),
                            picUrl = item.getString("imageUrl"),
                            price = item.getDouble("price"),
                            numberInCart = item.getInt("quantity")
                        )
                    )
                }

                cartAdapter.updateData(cartList)
                calculateTotal()
            },
            { error ->
                error.printStackTrace()
            }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return hashMapOf(
                    "Authorization" to "Bearer $token"
                )
            }
        }

        Volley.newRequestQueue(this).add(request)
    }


    private fun loadUserProfile() {

        val token = tinyDB.getValidToken()

        if (token == null) {
            binding.tvName.text = "Chưa đăng nhập"
            return
        }

        val url = "http://10.0.2.2:8080/user/info"


        val request = object : JsonObjectRequest(
            Request.Method.GET,
            url,
            null,
            { response ->
                val fullName = response.optString("fullName")
                val phone = response.optString("phoneNumber")
                val address = response.optString("address")

                binding.tvName.text = fullName
                binding.tvPhone.text =
                    if (phone.isNullOrEmpty()) "Chưa có số điện thoại" else phone
                binding.tvAddress.text =
                    if (address.isNullOrEmpty()) "Chưa có địa chỉ" else address
            },
            { error ->
                if (error.networkResponse?.statusCode == 401) {
                    tinyDB.clearToken()
                    binding.tvName.text = "Phiên đăng nhập hết hạn"
                }
            }
        ) {
            override fun getHeaders(): MutableMap<String, String> {
                return hashMapOf(
                    "Authorization" to "Bearer $token",
                )
            }
        }
        Volley.newRequestQueue(this).add(request)
    }

    private fun updateQuantity(cartDetailId: Int, quantity: Int) {
        val token = tinyDB.getValidToken() ?: return

        val url = "http://10.0.2.2:8080/carts/update"

        val body = org.json.JSONObject().apply {
            put("cartDetailID", cartDetailId)
            put("quantity", quantity)
        }

        val request = object : JsonObjectRequest(
            Request.Method.PUT,
            url,
            body,
            { /* OK */ },
            { error ->
                error.printStackTrace()
                Toast.makeText(this, "Cập nhật số lượng thất bại", Toast.LENGTH_SHORT).show()
            }
        ) {
            override fun getHeaders() = hashMapOf(
                "Authorization" to "Bearer $token",
                "Content-Type" to "application/json"
            )
        }

        Volley.newRequestQueue(this).add(request)
    }

    private fun calculateTotal() {
        val shippingFee = 20000.0
        var subtotal = 0.0

        val items = cartAdapter.getItems()
        items.forEach {
            subtotal += it.price * it.numberInCart
        }
        binding.tvTotal.text = formatMoney(subtotal + shippingFee)
    }

    private fun formatMoney(value: Double): String {
        val formatter = java.text.NumberFormat.getInstance(
            java.util.Locale("vi", "VN")
        )
        return formatter.format(value) + "đ"
    }


}
