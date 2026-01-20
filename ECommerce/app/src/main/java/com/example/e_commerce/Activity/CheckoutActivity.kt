package com.example.e_commerce.Activity

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import androidx.browser.customtabs.CustomTabsIntent
import com.android.volley.toolbox.Volley
import com.example.e_commerce.Helper.TinyDB
import com.example.e_commerce.databinding.ActivityCheckoutBinding
import com.example.e_commerce.Adapter.CartAdapter
import com.example.e_commerce.Model.CartItemModel
import com.example.e_commerce.Adapter.Action.OnCartItemActionListener
import org.json.JSONObject

class CheckoutActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCheckoutBinding
    private lateinit var tinyDB: TinyDB
    private var isPaypalHandled = false

    private lateinit var cartAdapter : CartAdapter
    private val TAG = "PAYPAL_FLOW"


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCheckoutBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tinyDB = TinyDB(this)

        initRecyclerView()
        initActions()

        loadCartData()
        loadUserProfile()

        handlePaypalCallback(intent)

    }
    private fun initRecyclerView() {
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

        binding.rvProducts.layoutManager = LinearLayoutManager(this)
        binding.rvProducts.adapter = cartAdapter
    }

    private fun initActions() {
        binding.btnPlaceOrder.setOnClickListener {
            when {
                binding.rbPaypal.isChecked -> createPaypalOrder()
                binding.rbCOD.isChecked -> createOrderCOD()
                else -> {
                    Toast.makeText(this, "Vui lòng chọn phương thức thanh toán", Toast.LENGTH_SHORT).show()
                }
            }
        }
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
                Toast.makeText(this, "Không tải được giỏ hàng", Toast.LENGTH_SHORT).show()
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

    //CART
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


    //PAYPAL
    private fun createPaypalOrder() {
        val token = tinyDB.getValidToken() ?: return

        val url = "http://10.0.2.2:8080/paypal/create-order"

        val body = org.json.JSONObject()

        val request = object : JsonObjectRequest(
            Request.Method.POST,
            url,
            body,
            { response ->
                Log.d(TAG, "Create order SUCCESS: $response")
                val approvalUrl = response.getString("approvalUrl")
                Log.d(TAG, "Approval URL: $approvalUrl")
                openPaypal(approvalUrl)
            },
            { error ->
                error.printStackTrace()
                Log.e(TAG, "Create order FAILED", error)
                val msg = error.networkResponse?.data?.let {
                    String(it)
                }
                Log.e(TAG, "Error body: $msg")
                Toast.makeText(this, msg ?: "Lỗi PayPal", Toast.LENGTH_LONG).show()
            }
        ) {
            override fun getHeaders() = hashMapOf(
                "Authorization" to "Bearer $token"
            )
        }

        Volley.newRequestQueue(this).add(request)
    }
    private fun openPaypal(url: String) {
        val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url))
        startActivity(intent)
    }

    // ================= PAYPAL CALLBACK =================

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handlePaypalCallback(intent)
    }

    private fun capturePaypalOrder(orderId: String) {
        val token = tinyDB.getValidToken() ?: return
        val url = "http://10.0.2.2:8080/paypal/capture-order"

        val body = JSONObject().apply {
            put("orderId", orderId)
        }

        val request = object : JsonObjectRequest(
            Request.Method.POST,
            url,
            body,
            { response ->
                Log.d(TAG, "Capture SUCCESS: $response")
                if (response.getBoolean("success")) {
                    Toast.makeText(this, "Thanh toán thành công", Toast.LENGTH_LONG).show()
                    Log.d(TAG, "Paypal SUCCESS - orderId: $orderId")
                    goHome()
                }
            },
            { error ->
                Log.e(TAG, "Capture FAILED", error)
                Toast.makeText(this, "Thanh toán thất bại", Toast.LENGTH_SHORT).show()
            }
        ) {
            override fun getHeaders() = hashMapOf(
                "Authorization" to "Bearer $token",
                "Content-Type" to "application/json"
            )
        }

        Volley.newRequestQueue(this).add(request)
    }

    private fun goHome() {
        val intent = Intent(this, HomeActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish()
    }

    private fun handlePaypalCallback(intent: Intent?) {
        if (isPaypalHandled) return

        val uri = intent?.data ?: return

        if (uri.scheme != "myapp" || uri.host != "paypal") return

        val path = uri.path ?: uri.encodedPath ?: ""

        when {
            path.startsWith("/cancel") -> {
                isPaypalHandled = true
                Toast.makeText(this, "Bạn đã hủy thanh toán PayPal", Toast.LENGTH_SHORT).show()
            }

            path.startsWith("/success") -> {
                val orderId = uri.getQueryParameter("token")

                if (orderId.isNullOrEmpty()) {
                    isPaypalHandled = true
                    Toast.makeText(this, "Không lấy được mã đơn PayPal", Toast.LENGTH_LONG).show()
                    return
                }

                isPaypalHandled = true
                capturePaypalOrder(orderId)
            }
        }
    }

    private fun createOrderCOD() {
        val token = tinyDB.getValidToken() ?: return

        val url = "http://10.0.2.2:8080/orders/cod"

        val request = object : JsonObjectRequest(
            Request.Method.POST,
            url,
            null,
            { _ ->
                Toast.makeText(
                    this,
                    "Đặt hàng COD thành công",
                    Toast.LENGTH_LONG
                ).show()
                goHome()
            },
            { error ->
                error.printStackTrace()
                val msg = error.networkResponse?.data?.let { String(it) }
                Toast.makeText(
                    this,
                    msg ?: "Đặt hàng COD thất bại",
                    Toast.LENGTH_LONG
                ).show()
            }
        ) {
            override fun getHeaders() = hashMapOf(
                "Authorization" to "Bearer $token"
            )
        }

        Volley.newRequestQueue(this).add(request)
    }


}
